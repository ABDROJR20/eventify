import { NextResponse } from "next/server";
import dns from "dns";
import { getGeminiClient, SYSTEM_INSTRUCTION, CHATBOT_TOOLS, executeTool } from "@/lib/gemini";
import { getSessionUser } from "@/lib/auth";

// Force IPv4 DNS resolution to avoid 30s IPv6 socket timeouts on Windows/Node.js
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore in environments where not supported
}

// In-memory sliding window rate limiter
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 25; // max 25 messages per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const clientData = ipRequestCounts.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > clientData.resetAt) {
    clientData.count = 0;
    clientData.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }

  clientData.count += 1;
  ipRequestCounts.set(ip, clientData);

  // Periodic cleanup
  if (ipRequestCounts.size > 2000) {
    for (const [key, val] of ipRequestCounts.entries()) {
      if (now > val.resetAt) ipRequestCounts.delete(key);
    }
  }

  return clientData.count <= MAX_REQUESTS_PER_WINDOW;
}

export async function POST(request) {
  try {
    // 1. Get client IP for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many messages sent. Please wait a moment before asking again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate request body
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Message exceeds maximum allowed length (1000 characters)." },
        { status: 400 }
      );
    }

    // 3. Authenticate current user from session cookie (if logged in)
    let sessionUser = null;
    try {
      sessionUser = await getSessionUser();
    } catch (e) {
      sessionUser = null;
    }

    // 4. Initialize Gemini client
    let ai;
    try {
      ai = getGeminiClient();
    } catch (err) {
      console.error("Gemini initialization error: API key missing");
      return NextResponse.json(
        {
          success: false,
          error: "AI service configuration missing. Please verify GEMINI_API_KEY.",
        },
        { status: 500 }
      );
    }

    // 5. Build conversation contents for Gemini
    const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
    const contents = [];

    for (const item of recentHistory) {
      if (item.sender === "user" && item.text) {
        contents.push({
          role: "user",
          parts: [{ text: String(item.text).slice(0, 500) }],
        });
      } else if (item.sender === "bot" && item.text) {
        contents.push({
          role: "model",
          parts: [{ text: String(item.text).slice(0, 1000) }],
        });
      }
    }

    // Add current user query with context if user is signed in
    const userPrompt = sessionUser
      ? `[User Context: Logged in as ${sessionUser.name} (${sessionUser.email})]\n${message.trim()}`
      : message.trim();

    contents.push({
      role: "user",
      parts: [{ text: userPrompt }],
    });

    const modelCandidates = [
      "gemini-3.5-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.8-flash",
    ];
    let finalAnswer = "";
    let toolResultsCollected = [];
    let lastError = null;

    // 6. Execute Gemini with Tool Calling Loop
    for (const modelName of modelCandidates) {
      try {
        let iterations = 0;
        const maxIterations = 4;
        let currentContents = [...contents];

        while (iterations < maxIterations) {
          iterations++;

          const response = await ai.models.generateContent({
            model: modelName,
            contents: currentContents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              tools: CHATBOT_TOOLS,
              temperature: 0.7,
            },
          });

          // Check if function calls were requested
          const functionCalls = response.functionCalls || [];

          if (functionCalls.length > 0) {
            // Preserve the model candidate's content directly to keep thoughtSignature intact
            const candidateContent = response.candidates?.[0]?.content;
            if (candidateContent) {
              currentContents.push(candidateContent);
            } else {
              const modelParts = functionCalls.map((fc) => ({
                functionCall: {
                  name: fc.name,
                  args: fc.args || {},
                  ...(fc.id ? { id: fc.id } : {}),
                },
              }));
              currentContents.push({
                role: "model",
                parts: modelParts,
              });
            }

            // Execute each tool and return function responses
            const toolResponseParts = [];
            for (const fc of functionCalls) {
              const toolResult = await executeTool(fc.name, fc.args || {}, sessionUser);
              toolResultsCollected.push({ tool: fc.name, result: toolResult });

              toolResponseParts.push({
                functionResponse: {
                  name: fc.name,
                  response: toolResult,
                  ...(fc.id ? { id: fc.id } : {}),
                },
              });
            }

            currentContents.push({
              role: "user",
              parts: toolResponseParts,
            });

            continue;
          }

          finalAnswer = response.text || "";
          break;
        }

        if (finalAnswer) {
          break; // Successfully got an answer
        }
      } catch (geminiError) {
        lastError = geminiError;
        console.warn(`[Gemini Error] Model ${modelName} failed:`, geminiError.message);
      }
    }

    // 7. If Gemini failed, return appropriate 503 HTTP status
    if (!finalAnswer) {
      console.error("[Gemini Service Failure] All model candidates failed.", lastError?.message);
      return NextResponse.json(
        {
          success: false,
          error: "AI service temporarily unavailable. Please retry in a moment.",
          details: lastError?.message?.slice(0, 200) || "Model execution failed",
        },
        { status: 503 }
      );
    }

    // 8. Return successful response with HTTP 200
    return NextResponse.json(
      {
        success: true,
        text: finalAnswer,
        toolResults: toolResultsCollected.length > 0 ? toolResultsCollected : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chat API route unhandled error:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while processing chat.",
      },
      { status: 500 }
    );
  }
}
