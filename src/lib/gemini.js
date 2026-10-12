import dns from "dns";
import { GoogleGenAI } from "@google/genai";
import { getAllEvents, getEventById, getAllRegistrations } from "./db";

// Ensure IPv4 is preferred to avoid 30s IPv6 socket timeouts
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore in environments where not supported
}

// Secure server-side Gemini AI client
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
}

// System instructions for Eventify Assistant
export const SYSTEM_INSTRUCTION = `
You are the official Eventify AI Assistant. Eventify is an elite Event Management and Ticket Booking platform (https://eventify-tawny-one.vercel.app).
Your goal is to assist attendees and organizers with event discovery, ticket pricing, booking status, check-in instructions, and general platform help.

LANGUAGE CAPABILITY:
- You must support both English and Roman Urdu naturally.
- Automatically detect the user's language and respond in the same language (e.g. if the user asks "Karachi mein events kaun se hain?", answer in natural Roman Urdu. If they ask in English, answer in English).

CORE CAPABILITIES & TOOLS:
1. Event Search & Discovery: Use the 'searchEvents' tool to find real events in the database by title, category, city/location, or budget. Never invent or hallucinate events.
2. Event Details & Prices: Use the 'getEventDetails' tool to check dates, venue, ticket tiers, prices, and availability.
3. User Bookings & Tickets:
   - For signed-in users, use 'getMyBookings' to check their registered event tickets and passes.
   - If a user is not signed in and asks about their tickets or bookings, politely inform them that they must sign in to Eventify to access private booking records.
4. Booking / Purchasing Guidance:
   - Guide users to visit the specific event page link (e.g., /events/{id}) to purchase tickets.
   - Never claim you have completed a payment or booking inside the chat.
5. QR Pass & Check-In:
   - Explain that each booked ticket receives a dynamic QR Pass sent via email and visible on the order confirmation page.
   - Attendees present the QR pass at the entrance or verify it at /verify-ticket for under 2-second check-in.

STYLE & ACCURACY:
- Be warm, professional, concise, and helpful.
- When recommending events, include the Event Title, Date, Location, and Price (in PKR or Free).
- ALWAYS provide actionable destination buttons for each event or action using markdown link syntax: [Button Label](destination_path)
  Examples:
  - For viewing an event: [View Event Details](/events/{id}) or [View 3D Event Pass](/events/{id})
  - For browsing events: [Explore All Events](/events)
  - For ticket check-in: [Verify QR Ticket](/verify-ticket)
  - For login: [Sign In to Eventify](/auth?role=attendee)
- Use clean formatting. When listing items, use bullet points or numbered lists. Do not leave unformatted or orphan asterisks.
- Never hallucinate prices, dates, or non-existent features.
`;

// Declarations for Gemini Tool Calling
export const CHATBOT_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "searchEvents",
        description: "Search active and published events on Eventify by keyword, category, location/city, or max price.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "Search keyword for event title, topic, or speaker.",
            },
            category: {
              type: "STRING",
              description: "Event category (e.g., Technology, Design, Workshops, Business, General).",
            },
            location: {
              type: "STRING",
              description: "City or venue location (e.g., Karachi, Lahore, Islamabad, Online).",
            },
            maxPrice: {
              type: "NUMBER",
              description: "Maximum ticket price in PKR.",
            },
          },
        },
      },
      {
        name: "getEventDetails",
        description: "Get full details, dates, venue, speakers, ticket price, and capacity for a specific event.",
        parameters: {
          type: "OBJECT",
          properties: {
            eventId: {
              type: "STRING",
              description: "The unique event ID (e.g., '1', 'evt_1', 'evt_2').",
            },
            title: {
              type: "STRING",
              description: "The title or partial title of the event if ID is unknown.",
            },
          },
        },
      },
      {
        name: "getMyBookings",
        description: "Retrieve booked tickets and registrations for the currently authenticated user.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "getTicketVerificationInfo",
        description: "Look up ticket details using a ticket code (e.g., EVT-XXXXX) or order ID (e.g., #ORD-XXXX).",
        parameters: {
          type: "OBJECT",
          properties: {
            ticketCode: {
              type: "STRING",
              description: "Ticket Code or Order ID to verify.",
            },
          },
          required: ["ticketCode"],
        },
      },
      {
        name: "getPlatformHelp",
        description: "Get accurate information about Eventify features, QR check-in, organizer tools, payments, or support.",
        parameters: {
          type: "OBJECT",
          properties: {
            topic: {
              type: "STRING",
              description: "Help topic such as 'qr_checkin', 'create_event', 'payment_methods', 'refund_policy', 'contact_support'.",
            },
          },
          required: ["topic"],
        },
      },
    ],
  },
];

// Backend Tool Execution Handlers
export async function executeTool(name, args, sessionUser = null) {
  try {
    switch (name) {
      case "searchEvents": {
        const events = await getAllEvents();
        const publishedEvents = events.filter((e) => e.status !== "Draft");

        let results = publishedEvents;

        if (args.query) {
          const q = args.query.toLowerCase();
          results = results.filter(
            (e) =>
              e.title?.toLowerCase().includes(q) ||
              e.description?.toLowerCase().includes(q) ||
              e.category?.toLowerCase().includes(q)
          );
        }

        if (args.category) {
          const cat = args.category.toLowerCase();
          results = results.filter((e) => e.category?.toLowerCase().includes(cat));
        }

        if (args.location) {
          const loc = args.location.toLowerCase();
          results = results.filter((e) => e.location?.toLowerCase().includes(loc));
        }

        if (args.maxPrice !== undefined && args.maxPrice !== null) {
          results = results.filter((e) => (Number(e.price) || 0) <= Number(args.maxPrice));
        }

        return {
          count: results.length,
          events: results.slice(0, 5).map((e) => ({
            id: String(e.id).replace("evt_", ""),
            fullId: e.id,
            title: e.title,
            category: e.category,
            date: e.date,
            time: e.time,
            location: e.location,
            price: e.priceDisplay || (e.price ? `PKR ${e.price}` : "Free"),
            url: `/events/${String(e.id).replace("evt_", "")}`,
          })),
        };
      }

      case "getEventDetails": {
        const events = await getAllEvents();
        let event = null;

        if (args.eventId) {
          const cleanId = String(args.eventId);
          event = events.find(
            (e) =>
              String(e.id) === cleanId ||
              String(e.id) === `evt_${cleanId}` ||
              String(e.id).replace("evt_", "") === cleanId
          );
        }

        if (!event && args.title) {
          const t = args.title.toLowerCase();
          event = events.find((e) => e.title?.toLowerCase().includes(t));
        }

        if (!event) {
          return { found: false, message: "No event found matching the provided criteria." };
        }

        return {
          found: true,
          event: {
            id: String(event.id).replace("evt_", ""),
            title: event.title,
            category: event.category,
            date: event.date,
            time: event.time,
            location: event.location,
            price: event.priceDisplay || (event.price ? `PKR ${event.price}` : "Free"),
            description: event.description,
            speakers: event.speakers || [],
            capacity: event.capacity,
            ticketsSold: event.ticketsSold || 0,
            url: `/events/${String(event.id).replace("evt_", "")}`,
          },
        };
      }

      case "getMyBookings": {
        if (!sessionUser || !sessionUser.email) {
          return {
            authenticated: false,
            message: "User is not signed in. Please sign in to your Eventify account to view your bookings.",
          };
        }

        const registrations = await getAllRegistrations();
        const userEmail = sessionUser.email.toLowerCase().trim();

        const userBookings = registrations.filter(
          (r) => r.customerEmail && r.customerEmail.toLowerCase().trim() === userEmail
        );

        return {
          authenticated: true,
          user: sessionUser.name || userEmail,
          count: userBookings.length,
          bookings: userBookings.map((b) => ({
            orderId: b.id,
            eventTitle: b.eventTitle,
            ticketCode: b.ticketCode,
            ticketType: b.ticketType,
            amount: b.amountDisplay || `PKR ${b.amount}`,
            status: b.status,
            checkedIn: Boolean(b.checkedIn),
            date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "Confirmed",
          })),
        };
      }

      case "getTicketVerificationInfo": {
        const rawCode = (args.ticketCode || "").trim().toUpperCase();
        const registrations = await getAllRegistrations();

        const reg = registrations.find(
          (r) =>
            (r.ticketCode && r.ticketCode.toUpperCase() === rawCode) ||
            (r.id && r.id.toUpperCase() === rawCode) ||
            (r.ticketCode && r.ticketCode.toUpperCase().includes(rawCode.replace("EVT-", "")))
        );

        if (!reg) {
          return { valid: false, message: `Ticket code '${rawCode}' not found in registry.` };
        }

        return {
          valid: true,
          ticketCode: reg.ticketCode,
          orderId: reg.id,
          eventTitle: reg.eventTitle,
          attendeeName: reg.customerName,
          ticketType: reg.ticketType,
          status: reg.status,
          checkedIn: Boolean(reg.checkedIn),
        };
      }

      case "getPlatformHelp": {
        const topic = (args.topic || "").toLowerCase();
        const helpMap = {
          qr_checkin: "Eventify offers instant paperless QR check-in. Once you register for an event, you receive a digital QR pass on your confirmation screen and via email. Present this QR code at the event gate or verify it at /verify-ticket for under 2-second check-in.",
          create_event: "Organizers can create and manage events from the Portal (/portal) or Dashboard (/dashboard). You can set ticket tiers, capacity, pricing in PKR, and monitor live sales analytics.",
          payment_methods: "Eventify supports Stripe (Credit/Debit cards with instant USD conversion), local wallets (EasyPaisa, JazzCash), and direct Bank Transfers.",
          refund_policy: "Refunds depend on the event organizer's policy. Reach out to the event organizer or support with your Order ID (#ORD-XXXX).",
          contact_support: "You can reach Eventify support through our contact form or by emailing support@eventify.pk.",
        };

        return {
          topic,
          answer: helpMap[topic] || "Eventify is Pakistan's premier event management platform with 3D digital passes, paperless QR check-in, and real-time organizer dashboards.",
        };
      }

      default:
        return { error: `Tool ${name} not recognized.` };
    }
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    return { error: error.message };
  }
}
