"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle
} from "lucide-react";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "bot",
    text: "Hi! I'm your Eventify AI Assistant. I can help you find upcoming events, check ticket prices, view your bookings, or answer questions in English & Roman Urdu. How can I help you today?",
    time: "Just now",
  },
];

const QUICK_PROMPTS = [
  "Find upcoming tech events",
  "Karachi mein events kaun se hain?",
  "How does QR check-in work?",
  "My booked tickets",
];

// Render styled inline text (bold, italic, clean text without raw asterisks)
function renderInlineText(text, keyPrefix = "txt") {
  if (!text) return null;

  // 1. Process bold: **text**
  const boldParts = text.split(/(\*\*[^*]+?\*\*)/g);

  return boldParts.map((bPart, bIdx) => {
    if (bPart.startsWith("**") && bPart.endsWith("**") && bPart.length > 4) {
      const boldContent = bPart.slice(2, -2).trim();
      return (
        <strong key={`${keyPrefix}-b-${bIdx}`} className="font-semibold text-slate-900 dark:text-white">
          {boldContent}
        </strong>
      );
    }

    // 2. Process italic: *text* or _text_
    const italicParts = bPart.split(/(\*[^*]+?\*|_[^_]+?_)/g);
    return italicParts.map((iPart, iIdx) => {
      if (
        (iPart.startsWith("*") && iPart.endsWith("*") && iPart.length > 2) ||
        (iPart.startsWith("_") && iPart.endsWith("_") && iPart.length > 2)
      ) {
        const italicContent = iPart.slice(1, -1).trim();
        return (
          <em key={`${keyPrefix}-i-${bIdx}-${iIdx}`} className="italic text-slate-800 dark:text-slate-200">
            {italicContent}
          </em>
        );
      }

      // 3. Remove any remaining orphan asterisks so no '*' is ever displayed as raw text
      const cleaned = iPart.replace(/\*+/g, "");
      return <span key={`${keyPrefix}-s-${bIdx}-${iIdx}`}>{cleaned}</span>;
    });
  });
}

// Extract markdown links or raw event routes from a text line
function extractLinksAndContent(line) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const buttons = [];
  let remainingText = line;

  let match;
  while ((match = linkRegex.exec(line)) !== null) {
    buttons.push({
      label: match[1].trim(),
      url: match[2].trim(),
    });
  }

  // Remove markdown links from remaining text
  remainingText = remainingText.replace(linkRegex, "").trim();

  // If no markdown links found, detect raw internal paths (e.g. /events/123 or /verify-ticket)
  if (buttons.length === 0) {
    const rawPathRegex = /(?:^|\s)(\/(?:events(?:\/[a-zA-Z0-9_\-]+)?|verify-ticket|profile|tickets))(?:$|\s|[.,!?])/;
    const pathMatch = remainingText.match(rawPathRegex);
    if (pathMatch) {
      const detectedPath = pathMatch[1];
      let btnLabel = "View Event Details";
      if (detectedPath.includes("verify-ticket")) btnLabel = "Verify QR Ticket";
      else if (detectedPath.includes("profile") || detectedPath.includes("tickets")) btnLabel = "View My Tickets";
      else if (detectedPath === "/events") btnLabel = "Browse All Events";
      else if (detectedPath.startsWith("/events/")) btnLabel = "View 3D Event Pass";

      buttons.push({
        label: btnLabel,
        url: detectedPath,
      });
      remainingText = remainingText.replace(detectedPath, "").trim();
    }
  }

  return {
    cleanText: remainingText,
    buttons,
  };
}

// Action button component matching user's requested pill design ("View 3D Event Pass ->")
function ActionButton({ label, url, onNavigate }) {
  const isExternal = url.startsWith("http://") || url.startsWith("https://");

  return (
    <button
      type="button"
      onClick={() => onNavigate(url)}
      className="w-full my-1.5 py-2.5 px-4 bg-blue-50/90 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold rounded-full border border-blue-200/70 dark:border-blue-800/60 shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer group text-xs sm:text-sm tracking-wide"
      title={isExternal ? `Open ${label}` : `Navigate to ${label}`}
    >
      <span className="truncate">{label}</span>
      <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1 text-blue-600 dark:text-blue-400" />
    </button>
  );
}

// Helper to format messages professionally without raw asterisks and turn links into pill buttons
function FormattedMessage({ text, onNavigate }) {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed break-words text-xs sm:text-sm">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="h-1.5" />;
        }

        // 1. Headings: ### Title or ## Title
        if (/^#{1,6}\s+/.test(line)) {
          const headingText = line.replace(/^#{1,6}\s+/, "");
          return (
            <h4 key={idx} className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mt-2.5 mb-1 tracking-tight">
              {renderInlineText(headingText, `h-${idx}`)}
            </h4>
          );
        }

        // 2. Unordered Bullet points: * Item or - Item or • Item
        const isBullet = /^[\*\-•]\s+/.test(line);
        if (isBullet) {
          const contentAfterBullet = line.replace(/^[\*\-•]\s+/, "");
          const { cleanText, buttons } = extractLinksAndContent(contentAfterBullet);

          return (
            <div key={idx} className="my-1.5">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  {cleanText && renderInlineText(cleanText, `b-${idx}`)}
                </div>
              </div>
              {buttons.map((btn, bIdx) => (
                <div key={bIdx} className="pl-3.5">
                  <ActionButton label={btn.label} url={btn.url} onNavigate={onNavigate} />
                </div>
              ))}
            </div>
          );
        }

        // 3. Numbered lists: 1. Item or 2) Item
        const numMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const contentAfterNum = numMatch[2];
          const { cleanText, buttons } = extractLinksAndContent(contentAfterNum);

          return (
            <div key={idx} className="my-1.5">
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 border border-blue-200/50 dark:border-blue-800/40">
                  {num}
                </span>
                <div className="flex-1 min-w-0">
                  {cleanText && renderInlineText(cleanText, `num-${idx}`)}
                </div>
              </div>
              {buttons.map((btn, bIdx) => (
                <div key={bIdx} className="pl-4">
                  <ActionButton label={btn.label} url={btn.url} onNavigate={onNavigate} />
                </div>
              ))}
            </div>
          );
        }

        // 4. Regular Paragraph / Standalone Link
        const { cleanText, buttons } = extractLinksAndContent(line);

        return (
          <div key={idx} className="my-1">
            {cleanText && <p>{renderInlineText(cleanText, `p-${idx}`)}</p>}
            {buttons.map((btn, bIdx) => (
              <ActionButton key={bIdx} label={btn.label} url={btn.url} onNavigate={onNavigate} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function Chatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Smart Link Navigation with Authentication Gatekeeper
  const handleSmartNavigate = async (destinationUrl) => {
    if (!destinationUrl) return;

    // External URLs (e.g. https://example.com)
    if (destinationUrl.startsWith("http://") || destinationUrl.startsWith("https://")) {
      window.open(destinationUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setIsOpen(false); // Close chatbot modal to reveal destination

    // If destination is already an auth page, navigate directly
    if (destinationUrl.startsWith("/auth")) {
      router.push(destinationUrl);
      return;
    }

    try {
      // Verify whether user is currently signed in
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.authenticated && data.user) {
        // User is ALREADY signed in -> Go directly to destination!
        router.push(destinationUrl);
      } else {
        // User is NOT signed in -> Redirect to login page first, preserving destination!
        const authRedirectUrl = `/auth?role=attendee&redirect=${encodeURIComponent(destinationUrl)}`;
        router.push(authRedirectUrl);
      }
    } catch (err) {
      // Fallback on error: safely route to auth with redirect param
      const authRedirectUrl = `/auth?role=attendee&redirect=${encodeURIComponent(destinationUrl)}`;
      router.push(authRedirectUrl);
    }
  };

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : inputVal;
    if (!query || !query.trim() || isTyping) return;

    const trimmedQuery = query.trim();
    setLastQuery(trimmedQuery);
    setErrorMessage("");

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: trimmedQuery,
      time: "Just now",
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputVal("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedQuery,
          history: newHistory.slice(-8).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to get AI response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: data.text,
          time: "Just now",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setErrorMessage(err.message || "Could not connect to Eventify AI. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleSend(lastQuery);
    }
  };

  return (
    <>
      {/* Chat Window Modal Container */}
      <div
        className={`fixed z-[100] transition-all duration-300 ease-out origin-bottom-right
          bottom-20 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-24
          w-auto sm:w-[410px] max-w-[calc(100vw-1.5rem)] sm:max-w-[410px]
          h-[min(580px,calc(100dvh-6.5rem))] flex flex-col
          bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl
          rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]
          border border-slate-200/80 dark:border-slate-800/80 overflow-hidden
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
      >
        {/* Header */}
        <div className="shrink-0 bg-linear-to-r from-slate-900 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-5 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">Eventify AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">English • Roman Urdu • Live Events</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              title="Reset Conversation"
              aria-label="Reset Conversation"
            >
              <RefreshCw size={13} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              title="Close Assistant"
              aria-label="Close Chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Chat Body (Scrollable Messages Area) */}
        <div className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto bg-slate-50/80 dark:bg-slate-950/60 flex flex-col gap-3.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          {messages.map((m) => {
            if (m.sender === "user") {
              return (
                <div
                  key={m.id}
                  className="bg-brand-blue text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-xs shadow-md shadow-blue-500/20 max-w-[85%] self-end text-xs sm:text-sm leading-relaxed"
                >
                  <p>{m.text}</p>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3.5 sm:p-4 rounded-2xl rounded-tl-xs shadow-sm max-w-[88%] border border-slate-200/80 dark:border-slate-800/80 text-xs sm:text-sm leading-relaxed"
              >
                <FormattedMessage text={m.text} onNavigate={handleSmartNavigate} />
              </div>
            );
          })}

          {isTyping && (
            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl rounded-tl-xs border border-slate-200 dark:border-slate-800 self-start flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-[10px] text-slate-400 font-bold ml-1.5">Consulting Eventify database...</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <AlertCircle size={14} className="shrink-0 text-rose-500" />
                <span className="truncate">{errorMessage}</span>
              </div>
              <button
                onClick={handleRetry}
                className="text-[11px] font-bold underline shrink-0 hover:text-rose-900 dark:hover:text-rose-100 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="shrink-0 px-3 py-2 bg-slate-100/60 dark:bg-slate-950/40 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isTyping}
              className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-2.5 py-1 whitespace-nowrap transition-colors shrink-0 shadow-2xs hover:border-brand-blue/40 disabled:opacity-50 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="shrink-0 p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-300 dark:border-slate-800 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isTyping}
              maxLength={1000}
              placeholder={isTyping ? "Eventify AI is thinking..." : "Ask in English or Roman Urdu..."}
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 font-medium py-1.5 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-blue hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-brand-blue text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-md shadow-blue-500/25 cursor-pointer"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
          isOpen ? "bg-slate-900 dark:bg-slate-800 rotate-90 text-white" : "bg-brand-blue text-white"
        }`}
        aria-label="Toggle Eventify AI Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={26} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-950" />
          </span>
        )}
      </button>
    </>
  );
}
