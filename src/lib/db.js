import fs from "fs/promises";
import path from "path";
import os from "os";
import { getDatabase } from "./mongodb";

// Determine data directory (Vercel Serverless read-only environment vs Local dev)
const isServerless =
  process.env.VERCEL === "1" ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.VERCEL_ENV);

const DATA_DIR = isServerless
  ? path.join(os.tmpdir(), "eventify_data")
  : path.join(process.cwd(), ".data");

const BUNDLED_DATA_DIR = path.join(process.cwd(), ".data");

const USERS_FILE = path.join(DATA_DIR, "users.json");
const OTPS_FILE = path.join(DATA_DIR, "otps.json");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");
const ATTENDEES_FILE = path.join(DATA_DIR, "attendees.json");
const ACTIVITIES_FILE = path.join(DATA_DIR, "activities.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const NOTIFICATIONS_FILE = path.join(DATA_DIR, "notifications.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const TEAM_ROLES_FILE = path.join(DATA_DIR, "team_roles.json");

// In-Memory Global Fallback Cache for Serverless Lambdas
if (!globalThis.__eventify_users) globalThis.__eventify_users = null;
if (!globalThis.__eventify_otps) globalThis.__eventify_otps = {};
if (!globalThis.__eventify_events) globalThis.__eventify_events = null;
if (!globalThis.__eventify_registrations) globalThis.__eventify_registrations = null;
if (!globalThis.__eventify_attendees) globalThis.__eventify_attendees = null;
if (!globalThis.__eventify_activities) globalThis.__eventify_activities = null;
if (!globalThis.__eventify_settings) globalThis.__eventify_settings = null;
if (!globalThis.__eventify_notifications) globalThis.__eventify_notifications = null;
if (!globalThis.__eventify_reviews) globalThis.__eventify_reviews = null;
if (!globalThis.__eventify_team_roles) globalThis.__eventify_team_roles = null;

// Initial Seed Data
const SEED_EVENTS = [
  {
    id: "evt_1",
    title: "Global Tech Summit 2026",
    category: "Technology",
    date: "2026-06-12",
    time: "10:00 AM",
    location: "Karachi Expo Center, PK",
    price: 49.00,
    priceDisplay: "PKR 49.00",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop",
    attendeesCount: 500,
    capacity: 600,
    status: "Published",
    featured: true,
    ticketsSold: 425,
    revenue: 20825,
    description: "Join us for the most anticipated technology event of the year. The Global Tech Summit 2026 brings together the brightest minds in Artificial Intelligence, Machine Learning, and Software Engineering.",
    speakers: ["Muhammad Umer", "Aadrish Pirzado"],
    organizerId: "org_default",
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-15T12:00:00.000Z"
  },
  {
    id: "evt_2",
    title: "Design Leadership Workshop",
    category: "Design",
    date: "2026-07-05",
    time: "09:00 AM",
    location: "Pearl Continental, Lahore",
    price: 120.00,
    priceDisplay: "PKR 120.00",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80&fit=crop",
    attendeesCount: 200,
    capacity: 250,
    status: "Draft",
    featured: false,
    ticketsSold: 0,
    revenue: 0,
    description: "A premier gathering of creative directors and UX leaders. We will dive deep into design systems, accessible interfaces, and the future of creative collaboration.",
    speakers: ["Sarah Khan", "Ali Ahmed"],
    organizerId: "org_default",
    createdAt: "2026-02-01T08:00:00.000Z",
    updatedAt: "2026-02-01T08:00:00.000Z"
  },
  {
    id: "evt_3",
    title: "Web3 Developers Meetup",
    category: "Workshops",
    date: "2026-08-20",
    time: "06:00 PM",
    location: "Innovation Hub, Lahore",
    price: 15.00,
    priceDisplay: "PKR 15.00",
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80&fit=crop",
    attendeesCount: 300,
    capacity: 350,
    status: "Published",
    featured: false,
    ticketsSold: 180,
    revenue: 4500,
    description: "A hands-on coding workshop for building decentralized applications. Learn how to write smart contracts, integrate wallets, and deploy DApps.",
    speakers: ["Zainab Ali", "Blockchain Devs"],
    organizerId: "org_default",
    createdAt: "2026-02-15T14:00:00.000Z",
    updatedAt: "2026-02-20T16:00:00.000Z"
  },
  {
    id: "evt_4",
    title: "FinTech Founders Mixer",
    category: "Business",
    date: "2026-03-15",
    time: "05:00 PM",
    location: "Serena Hotel, Islamabad",
    price: 50.00,
    priceDisplay: "PKR 50.00",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80&fit=crop",
    attendeesCount: 310,
    capacity: 350,
    status: "Past",
    featured: false,
    ticketsSold: 310,
    revenue: 15500,
    description: "High-level networking mixer with venture capitalists, angel investors, and leading banking executives.",
    speakers: ["Hamza Tariq", "Finance Leaders"],
    organizerId: "org_default",
    createdAt: "2026-01-05T09:00:00.000Z",
    updatedAt: "2026-03-16T10:00:00.000Z"
  },
  {
    id: "evt_5",
    title: "Startup Pitch Night",
    category: "Business",
    date: "2026-09-10",
    time: "05:30 PM",
    location: "NIC Karachi",
    price: 0.00,
    priceDisplay: "Free",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80&fit=crop",
    attendeesCount: 150,
    capacity: 200,
    status: "Published",
    featured: true,
    ticketsSold: 85,
    revenue: 1275,
    description: "Watch top early-stage startups pitch their innovative ideas to a panel of esteemed investors.",
    speakers: ["Investor Panel"],
    organizerId: "org_default",
    createdAt: "2026-03-01T11:00:00.000Z",
    updatedAt: "2026-03-01T11:00:00.000Z"
  }
];

const SEED_ATTENDEES = [];
const SEED_REGISTRATIONS = [];
const SEED_ACTIVITIES = [];

const SEED_SETTINGS = {
  profile: {
    name: "Aadrish Pirzado",
    companyName: "Eventify Innovations",
    email: "aadrish@example.com",
    phone: "+92 300 9876543",
    bio: "We curate high-end technology and design events across Pakistan.",
    avatarUrl: "https://i.pravatar.cc/150?u=organizer",
    twitter: "https://twitter.com/eventifypk",
    linkedin: "https://linkedin.com/company/eventify",
  },
  payoutMethods: {
    stripe: {
      connected: true,
      accountId: "acct_1EventifyStripeOrg",
      email: "aadrish@example.com",
      currency: "PKR",
      instantPayouts: true,
      chargesEnabled: true,
      payoutsEnabled: true,
      detailsSubmitted: true,
    },
    bankAccount: {
      accountTitle: "Aadrish Pirzado",
      bankName: "Meezan Bank",
      accountNumber: "PK36MEZN0001234567898992",
      isDefault: true,
    },
    jazzCash: {
      accountNumber: "+92 300 9876543",
      accountName: "Aadrish Pirzado",
      isDefault: false,
    },
    easyPaisa: {
      accountNumber: "+92 300 9876543",
      accountName: "Aadrish Pirzado",
      isDefault: false,
    },
  },
  notifications: {
    ticketSalesAlerts: true,
    dailyDigest: true,
    marketingEmails: false,
    inAppSound: true,
    emailOnCheckIn: true,
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: new Date().toISOString(),
  },
  updatedAt: new Date().toISOString(),
};

const SEED_NOTIFICATIONS = [
  {
    id: "notif_1",
    recipientRole: "organizer",
    title: "New Ticket Booking 🎟️",
    message: "Muhammad Ali booked a ticket for Global Tech Summit 2026 (PKR 49.00).",
    type: "ticket",
    link: "/dashboard/registrations",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "notif_2",
    recipientRole: "organizer",
    title: "Stripe Payout Scheduled 💰",
    message: "Stripe payout of PKR 20,825 is scheduled to transfer to your linked Meezan Bank account.",
    type: "payout",
    link: "/dashboard/settings",
    read: false,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: "notif_3",
    recipientRole: "organizer",
    title: "QR Check-in Verified ✅",
    message: "Attendee checked in with dynamic QR code at Gate 1 (Karachi Expo Center).",
    type: "checkin",
    link: "/dashboard",
    read: true,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "notif_4",
    recipientRole: "attendee",
    title: "Booking Confirmed! 🎟️",
    message: "Your ticket for Global Tech Summit 2026 is confirmed. Your 3D Event Pass is ready.",
    type: "ticket",
    link: "/portal",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "notif_5",
    recipientRole: "attendee",
    title: "Event Reminder ⏰",
    message: "Global Tech Summit 2026 is coming up soon. Present your QR code at entrance.",
    type: "event",
    link: "/events/evt_1",
    read: false,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "notif_6",
    recipientRole: "all",
    title: "Eventify 3D Pass Experience Live 🚀",
    message: "Interactive 3D passes with real-time motion and QR verification are now active.",
    type: "system",
    link: "/events",
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

const SEED_REVIEWS = [
  {
    id: "rev_1",
    name: "Aadrish Pirzado",
    role: "Verified Attendee",
    eventTitle: "Global Tech Summit 2026",
    rating: 5,
    comment: "The 3D interactive pass was incredible and entry via camera QR scanner took literally 2 seconds at Karachi Expo Center!",
    createdAt: "2026-03-15T10:30:00.000Z",
    initials: "AP",
    avatarColor: "bg-blue-600"
  },
  {
    id: "rev_2",
    name: "Sarah Connor",
    role: "Hackathon Organizer",
    eventTitle: "Fullstack JavaScript Bootcamp",
    rating: 5,
    comment: "Managing our guestlist, broadcasting updates, and tracking real-time revenue made running our conference seamless.",
    createdAt: "2026-03-20T14:15:00.000Z",
    initials: "SC",
    avatarColor: "bg-emerald-600"
  },
  {
    id: "rev_3",
    name: "Hamza Ansari",
    role: "VIP Pass Holder",
    eventTitle: "AI & Robotics Showcase",
    rating: 5,
    comment: "Booked with Stripe, received immediate email ticket with scannable QR badge, and AI bot answered all my schedule questions.",
    createdAt: "2026-04-02T16:45:00.000Z",
    initials: "HA",
    avatarColor: "bg-indigo-600"
  },
  {
    id: "rev_4",
    name: "Fatima Zahra",
    role: "Design Workshop Attendee",
    eventTitle: "UI/UX & Design Systems Summit",
    rating: 5,
    comment: "By far the most intuitive event ticketing system in Pakistan. The dark mode UI and real-time alerts are top tier.",
    createdAt: "2026-04-10T09:20:00.000Z",
    initials: "FZ",
    avatarColor: "bg-purple-600"
  },
  {
    id: "rev_5",
    name: "Alex Mercer",
    role: "Event Co-Host",
    eventTitle: "Startup Pitch & Networking Night",
    rating: 5,
    comment: "The Stripe Connect integration for instant payouts and real-time notifications on every sale gave us total peace of mind.",
    createdAt: "2026-04-12T11:00:00.000Z",
    initials: "AM",
    avatarColor: "bg-rose-600"
  }
];

const SEED_TEAM_ROLES = [
  {
    id: "role_seed_1",
    name: "Gate Scanner Staff",
    email: "scanner@eventify.pk",
    eventId: "evt_1",
    eventTitle: "Global Tech Summit 2026",
    roleTitle: "Gate Scanner & Check-in",
    permissions: {
      canCheckIn: true,
      canViewAttendees: true,
      canEditEvent: false,
      canSendBroadcast: false,
      canViewRevenue: false,
    },
    status: "Active",
    invitedBy: "usr_1791805734421_mwzyzz5",
    invitedByEmail: "hafizabdullah.munawar786@gmail.com",
    invitedByName: "Abdullah Munawar",
    inviteToken: "inv_seed_token_1",
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-04-01T10:00:00.000Z",
  }
];

// Ensure directory and files exist with seed data migration
async function ensureFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Check/seed users.json
    try {
      await fs.access(USERS_FILE);
    } catch {
      let initialUsers = [];
      try {
        const bundledUsers = await fs.readFile(
          path.join(BUNDLED_DATA_DIR, "users.json"),
          "utf8"
        );
        initialUsers = JSON.parse(bundledUsers || "[]");
      } catch {
        initialUsers = [];
      }
      await fs.writeFile(USERS_FILE, JSON.stringify(initialUsers, null, 2), "utf8");
      globalThis.__eventify_users = initialUsers;
    }

    // Check/seed otps.json
    try {
      await fs.access(OTPS_FILE);
    } catch {
      await fs.writeFile(OTPS_FILE, JSON.stringify({}, null, 2), "utf8");
    }

    // Check/seed events.json
    try {
      await fs.access(EVENTS_FILE);
    } catch {
      await fs.writeFile(EVENTS_FILE, JSON.stringify(SEED_EVENTS, null, 2), "utf8");
      globalThis.__eventify_events = SEED_EVENTS;
    }

    // Check/seed attendees.json
    try {
      await fs.access(ATTENDEES_FILE);
    } catch {
      await fs.writeFile(ATTENDEES_FILE, JSON.stringify(SEED_ATTENDEES, null, 2), "utf8");
      globalThis.__eventify_attendees = SEED_ATTENDEES;
    }

    // Check/seed registrations.json
    try {
      await fs.access(REGISTRATIONS_FILE);
    } catch {
      await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(SEED_REGISTRATIONS, null, 2), "utf8");
      globalThis.__eventify_registrations = SEED_REGISTRATIONS;
    }

    // Check/seed activities.json
    try {
      await fs.access(ACTIVITIES_FILE);
    } catch {
      await fs.writeFile(ACTIVITIES_FILE, JSON.stringify(SEED_ACTIVITIES, null, 2), "utf8");
      globalThis.__eventify_activities = SEED_ACTIVITIES;
    }

    // Check/seed settings.json
    try {
      await fs.access(SETTINGS_FILE);
    } catch {
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(SEED_SETTINGS, null, 2), "utf8");
      globalThis.__eventify_settings = SEED_SETTINGS;
    }

    // Check/seed notifications.json
    try {
      await fs.access(NOTIFICATIONS_FILE);
    } catch {
      await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(SEED_NOTIFICATIONS, null, 2), "utf8");
      globalThis.__eventify_notifications = SEED_NOTIFICATIONS;
    }

    // Check/seed reviews.json
    try {
      await fs.access(REVIEWS_FILE);
    } catch {
      await fs.writeFile(REVIEWS_FILE, JSON.stringify(SEED_REVIEWS, null, 2), "utf8");
      globalThis.__eventify_reviews = SEED_REVIEWS;
    }

    // Check/seed team_roles.json
    try {
      await fs.access(TEAM_ROLES_FILE);
    } catch {
      await fs.writeFile(TEAM_ROLES_FILE, JSON.stringify(SEED_TEAM_ROLES, null, 2), "utf8");
      globalThis.__eventify_team_roles = SEED_TEAM_ROLES;
    }
  } catch (error) {
    console.warn("Storage warning (falling back to memory):", error.message);
    if (!globalThis.__eventify_users) globalThis.__eventify_users = [];
    if (!globalThis.__eventify_events) globalThis.__eventify_events = SEED_EVENTS;
    if (!globalThis.__eventify_attendees) globalThis.__eventify_attendees = SEED_ATTENDEES;
    if (!globalThis.__eventify_registrations) globalThis.__eventify_registrations = SEED_REGISTRATIONS;
    if (!globalThis.__eventify_activities) globalThis.__eventify_activities = SEED_ACTIVITIES;
    if (!globalThis.__eventify_settings) globalThis.__eventify_settings = SEED_SETTINGS;
    if (!globalThis.__eventify_notifications) globalThis.__eventify_notifications = SEED_NOTIFICATIONS;
    if (!globalThis.__eventify_reviews) globalThis.__eventify_reviews = SEED_REVIEWS;
    if (!globalThis.__eventify_team_roles) globalThis.__eventify_team_roles = SEED_TEAM_ROLES;
  }
}

// ==========================================
// USER CRUD HELPERS
// ==========================================
export async function getAllUsers() {
  try {
    const db = await getDatabase();
    if (db) {
      const users = await db.collection("users").find({}).toArray();
      if (users && users.length > 0) {
        return users.map(({ _id, ...u }) => u);
      }
    }
  } catch (e) {
    console.warn("MongoDB getAllUsers fallback:", e.message);
  }

  await ensureFiles();
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const users = JSON.parse(data || "[]");
    globalThis.__eventify_users = users;
    return users;
  } catch {
    return globalThis.__eventify_users || [];
  }
}

export async function findUserByEmail(email) {
  if (!email) return null;
  const normalized = email.toLowerCase().trim();
  try {
    const db = await getDatabase();
    if (db) {
      const user = await db.collection("users").findOne({ email: normalized });
      if (user) {
        const { _id, ...cleanUser } = user;
        return cleanUser;
      }
    }
  } catch (e) {
    console.warn("MongoDB findUserByEmail fallback:", e.message);
  }

  const users = await getAllUsers();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function findUserById(id) {
  if (!id) return null;
  try {
    const db = await getDatabase();
    if (db) {
      const user = await db.collection("users").findOne({ id });
      if (user) {
        const { _id, ...cleanUser } = user;
        return cleanUser;
      }
    }
  } catch (e) {
    console.warn("MongoDB findUserById fallback:", e.message);
  }

  const users = await getAllUsers();
  return users.find((u) => u.id === id) || null;
}

export async function createUser({
  name,
  email,
  password,
  role = "attendee",
  provider = "credentials",
  image = null,
}) {
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const newUser = {
    id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
    name: name || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    password: password || null,
    role: role || "attendee",
    provider: provider || "credentials",
    image: image || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("users").insertOne({ ...newUser });
    }
  } catch (err) {
    console.warn("MongoDB createUser write error:", err.message);
  }

  await ensureFiles();
  const users = await getAllUsers();
  users.push(newUser);
  globalThis.__eventify_users = users;

  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist user to file:", err.message);
  }

  return newUser;
}

export async function updateUser(email, updates) {
  const normalizedEmail = email.toLowerCase().trim();
  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("users").updateOne({ email: normalizedEmail }, { $set: updatedData });
    }
  } catch (e) {
    console.warn("MongoDB updateUser error:", e.message);
  }

  await ensureFiles();
  const users = await getAllUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...updatedData,
    };
    globalThis.__eventify_users = users;
    try {
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not persist user update to file:", err.message);
    }
    return users[index];
  }

  return { email: normalizedEmail, ...updatedData };
}

export async function updateUserPassword(email, newHashedPassword) {
  return updateUser(email, { password: newHashedPassword });
}

// ==========================================
// OTP STORE METHODS
// ==========================================
export async function getAllOtps() {
  await ensureFiles();
  try {
    const data = await fs.readFile(OTPS_FILE, "utf8");
    const otps = JSON.parse(data || "{}");
    globalThis.__eventify_otps = otps;
    return otps;
  } catch {
    return globalThis.__eventify_otps || {};
  }
}

export async function saveOtp(email, otp, expiresInMinutes = 10) {
  const normalizedEmail = email.toLowerCase().trim();
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  const otpRecord = {
    otp: String(otp).trim(),
    expiresAt,
    createdAt: Date.now(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("otps").updateOne(
        { email: normalizedEmail },
        { $set: { ...otpRecord, email: normalizedEmail } },
        { upsert: true }
      );
    }
  } catch (e) {
    console.warn("MongoDB saveOtp error:", e.message);
  }

  await ensureFiles();
  const otps = await getAllOtps();
  otps[normalizedEmail] = otpRecord;
  globalThis.__eventify_otps = otps;

  try {
    await fs.writeFile(OTPS_FILE, JSON.stringify(otps, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist OTP to file:", err.message);
  }

  return otpRecord;
}

export async function getOtp(email) {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const db = await getDatabase();
    if (db) {
      const record = await db.collection("otps").findOne({ email: normalizedEmail });
      if (record) {
        if (Date.now() > record.expiresAt) {
          await deleteOtp(email);
          return null;
        }
        return record;
      }
    }
  } catch (e) {
    console.warn("MongoDB getOtp error:", e.message);
  }

  await ensureFiles();
  const otps = await getAllOtps();
  const record = otps[normalizedEmail];
  if (!record) return null;

  if (Date.now() > record.expiresAt) {
    await deleteOtp(email);
    return null;
  }

  return record;
}

export async function deleteOtp(email) {
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("otps").deleteOne({ email: normalizedEmail });
    }
  } catch (e) {
    console.warn("MongoDB deleteOtp error:", e.message);
  }

  await ensureFiles();
  const otps = await getAllOtps();
  if (otps[normalizedEmail]) {
    delete otps[normalizedEmail];
    globalThis.__eventify_otps = otps;
    try {
      await fs.writeFile(OTPS_FILE, JSON.stringify(otps, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not delete OTP from file:", err.message);
    }
  }
}

// ==========================================
// EVENTS CRUD HELPERS
// ==========================================
export async function getAllEvents() {
  try {
    const db = await getDatabase();
    if (db) {
      const events = await db.collection("events").find({}).toArray();
      if (events && events.length > 0) {
        return events.map(({ _id, ...e }) => e);
      }
    }
  } catch (e) {
    console.warn("MongoDB getAllEvents fallback:", e.message);
  }

  await ensureFiles();
  try {
    const data = await fs.readFile(EVENTS_FILE, "utf8");
    const events = JSON.parse(data || "[]");
    globalThis.__eventify_events = events;
    return events;
  } catch {
    return globalThis.__eventify_events || SEED_EVENTS;
  }
}

export async function getEventById(id) {
  if (!id) return null;
  const events = await getAllEvents();
  return events.find((e) => String(e.id) === String(id)) || null;
}

export async function createEvent(eventData) {
  const newEvent = {
    id: "evt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    title: eventData.title || "Untitled Event",
    category: eventData.category || "General",
    date: eventData.date || new Date().toISOString().split("T")[0],
    time: eventData.time || "10:00 AM",
    location: eventData.location || "Online",
    price: Number(eventData.price) || 0,
    priceDisplay: Number(eventData.price) > 0 ? `PKR ${Number(eventData.price).toFixed(2)}` : "Free",
    image: eventData.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop",
    attendeesCount: 0,
    capacity: Number(eventData.capacity) || 100,
    status: eventData.status || "Draft",
    ticketsSold: 0,
    revenue: 0,
    description: eventData.description || "",
    speakers: Array.isArray(eventData.speakers) ? eventData.speakers : (eventData.speakers ? [eventData.speakers] : []),
    organizerId: eventData.organizerId || "org_default",
    organizerEmail: eventData.organizerEmail || null,
    organizerName: eventData.organizerName || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("events").insertOne({ ...newEvent });
    }
  } catch (e) {
    console.warn("MongoDB createEvent error:", e.message);
  }

  await ensureFiles();
  const events = await getAllEvents();
  events.unshift(newEvent);
  globalThis.__eventify_events = events;

  try {
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist event to file:", err.message);
  }

  await logActivity({
    user: "Organizer",
    action: "created event",
    event: newEvent.title,
  });

  return newEvent;
}

export async function updateEvent(id, updates) {
  const updatedPrice = updates.price !== undefined ? Number(updates.price) : undefined;
  const updatedPriceDisplay = updatedPrice !== undefined ? (updatedPrice > 0 ? `PKR ${updatedPrice.toFixed(2)}` : "Free") : undefined;

  const eventUpdates = {
    ...updates,
    ...(updatedPrice !== undefined && { price: updatedPrice }),
    ...(updatedPriceDisplay !== undefined && { priceDisplay: updates.priceDisplay || updatedPriceDisplay }),
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("events").updateOne({ id: String(id) }, { $set: eventUpdates });
    }
  } catch (e) {
    console.warn("MongoDB updateEvent error:", e.message);
  }

  await ensureFiles();
  const events = await getAllEvents();
  const index = events.findIndex((e) => String(e.id) === String(id));

  if (index !== -1) {
    events[index] = {
      ...events[index],
      ...eventUpdates,
    };
    globalThis.__eventify_events = events;
    try {
      await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not persist event updates:", err.message);
    }
    return events[index];
  }

  return { id, ...eventUpdates };
}

export async function deleteEvent(id) {
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("events").deleteOne({ id: String(id) });
    }
  } catch (e) {
    console.warn("MongoDB deleteEvent error:", e.message);
  }

  await ensureFiles();
  const events = await getAllEvents();
  const filtered = events.filter((e) => String(e.id) !== String(id));

  globalThis.__eventify_events = filtered;
  try {
    await fs.writeFile(EVENTS_FILE, JSON.stringify(filtered, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not delete event from file:", err.message);
  }

  return { success: true, id };
}

// ==========================================
// ATTENDEES CRUD HELPERS
// ==========================================
export async function getAllAttendees() {
  try {
    const db = await getDatabase();
    if (db) {
      const attendees = await db.collection("attendees").find({}).toArray();
      if (attendees && attendees.length > 0) {
        return attendees.map(({ _id, ...a }) => a);
      }
    }
  } catch (e) {
    console.warn("MongoDB getAllAttendees fallback:", e.message);
  }

  await ensureFiles();
  try {
    const data = await fs.readFile(ATTENDEES_FILE, "utf8");
    const attendees = JSON.parse(data || "[]");
    globalThis.__eventify_attendees = attendees;
    return attendees;
  } catch {
    return globalThis.__eventify_attendees || SEED_ATTENDEES;
  }
}

export async function getAttendeeById(id) {
  if (!id) return null;
  const attendees = await getAllAttendees();
  return attendees.find((a) => String(a.id) === String(id)) || null;
}

export async function createAttendee(data) {
  const newAttendee = {
    id: "att_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    name: data.name || "Anonymous Attendee",
    email: (data.email || "").toLowerCase().trim(),
    phone: data.phone || "",
    events: Number(data.events) || 1,
    vip: Boolean(data.vip),
    avatar: data.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(data.email || "att")}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("attendees").insertOne({ ...newAttendee });
    }
  } catch (e) {
    console.warn("MongoDB createAttendee error:", e.message);
  }

  await ensureFiles();
  const attendees = await getAllAttendees();
  attendees.unshift(newAttendee);
  globalThis.__eventify_attendees = attendees;

  try {
    await fs.writeFile(ATTENDEES_FILE, JSON.stringify(attendees, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist attendee:", err.message);
  }

  return newAttendee;
}

export async function updateAttendee(id, updates) {
  const attendeeUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("attendees").updateOne({ id: String(id) }, { $set: attendeeUpdates });
    }
  } catch (e) {
    console.warn("MongoDB updateAttendee error:", e.message);
  }

  await ensureFiles();
  const attendees = await getAllAttendees();
  const index = attendees.findIndex((a) => String(a.id) === String(id));

  if (index !== -1) {
    attendees[index] = {
      ...attendees[index],
      ...attendeeUpdates,
    };
    globalThis.__eventify_attendees = attendees;
    try {
      await fs.writeFile(ATTENDEES_FILE, JSON.stringify(attendees, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not update attendee in file:", err.message);
    }
    return attendees[index];
  }

  return { id, ...attendeeUpdates };
}

export async function deleteAttendee(id) {
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("attendees").deleteOne({ id: String(id) });
    }
  } catch (e) {
    console.warn("MongoDB deleteAttendee error:", e.message);
  }

  await ensureFiles();
  const attendees = await getAllAttendees();
  const filtered = attendees.filter((a) => String(a.id) !== String(id));
  globalThis.__eventify_attendees = filtered;

  try {
    await fs.writeFile(ATTENDEES_FILE, JSON.stringify(filtered, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not delete attendee from file:", err.message);
  }

  return { success: true, id };
}

// ==========================================
// REGISTRATIONS & ORDERS HELPERS
// ==========================================
export async function getAllRegistrations() {
  try {
    const db = await getDatabase();
    if (db) {
      const registrations = await db.collection("registrations").find({}).sort({ createdAt: -1 }).toArray();
      if (registrations && registrations.length > 0) {
        return registrations.map(({ _id, ...r }) => r);
      }
    }
  } catch (e) {
    console.warn("MongoDB getAllRegistrations fallback:", e.message);
  }

  await ensureFiles();
  try {
    const data = await fs.readFile(REGISTRATIONS_FILE, "utf8");
    const regs = JSON.parse(data || "[]");
    globalThis.__eventify_registrations = regs;
    return regs;
  } catch {
    return globalThis.__eventify_registrations || SEED_REGISTRATIONS;
  }
}

export async function createRegistration(data) {
  const idNum = Math.floor(1000 + Math.random() * 9000);
  const ticketCode = data.ticketCode || `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const newReg = {
    id: data.id || `#ORD-${idNum}`,
    eventId: data.eventId || "evt_1",
    eventTitle: data.eventTitle || "Global Tech Summit 2026",
    customerName: data.customerName || "Attendee",
    customerEmail: (data.customerEmail || "").toLowerCase().trim(),
    customerPhone: data.customerPhone || "",
    ticketType: data.ticketType || "Standard Access",
    ticketCount: Number(data.ticketCount) || 1,
    amount: Number(data.amount) || 0,
    amountDisplay: data.amountDisplay || `PKR ${(Number(data.amount) || 0).toFixed(2)}`,
    status: data.status || "Completed",
    checkedIn: Boolean(data.checkedIn),
    checkedInAt: data.checkedIn ? new Date().toISOString() : null,
    ticketCode: ticketCode,
    paymentMethod: data.paymentMethod || "Online",
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Upsert in MongoDB
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("registrations").updateOne(
        { id: newReg.id },
        { $set: newReg },
        { upsert: true }
      );
    }
  } catch (e) {
    console.warn("MongoDB createRegistration error:", e.message);
  }

  await ensureFiles();
  const registrations = await getAllRegistrations();
  // Avoid duplicate if existing
  const existingIndex = registrations.findIndex((r) => r.id === newReg.id || r.ticketCode === newReg.ticketCode);
  if (existingIndex !== -1) {
    registrations[existingIndex] = newReg;
  } else {
    registrations.unshift(newReg);
  }
  globalThis.__eventify_registrations = registrations;

  try {
    await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist registration:", err.message);
  }

  await logActivity({
    user: newReg.customerName,
    action: "registered for",
    event: newReg.eventTitle,
  });

  return newReg;
}

export async function updateRegistration(id, updates) {
  const regUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("registrations").updateOne(
        { $or: [{ id: String(id) }, { ticketCode: String(id) }] },
        { $set: regUpdates }
      );
    }
  } catch (e) {
    console.warn("MongoDB updateRegistration error:", e.message);
  }

  await ensureFiles();
  const registrations = await getAllRegistrations();
  const index = registrations.findIndex((r) => String(r.id) === String(id) || String(r.ticketCode) === String(id));

  if (index !== -1) {
    registrations[index] = {
      ...registrations[index],
      ...regUpdates,
    };
    globalThis.__eventify_registrations = registrations;
    try {
      await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not update registration in file:", err.message);
    }
    return registrations[index];
  }

  return { id, ...regUpdates };
}

export async function checkInTicket(query) {
  const trimmed = String(query).trim().toUpperCase();
  const cleanCode = trimmed.replace(/[^A-Z0-9-]/gi, "");

  let registrations = await getAllRegistrations();
  let reg = registrations.find(
    (r) =>
      (r.ticketCode && r.ticketCode.toUpperCase() === cleanCode) ||
      (r.id && r.id.toUpperCase() === cleanCode) ||
      (r.customerEmail && r.customerEmail.toUpperCase() === trimmed) ||
      (r.ticketCode && r.ticketCode.toUpperCase().includes(cleanCode.replace("EVT-", "")))
  );

  if (!reg) {
    return { success: false, message: "Ticket / Registration not found." };
  }

  if (reg.checkedIn) {
    return {
      success: false,
      alreadyCheckedIn: true,
      registration: reg,
      message: `Already checked in at ${new Date(reg.checkedInAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    };
  }

  const updated = await updateRegistration(reg.id, {
    checkedIn: true,
    checkedInAt: new Date().toISOString(),
    status: "Checked In",
  });

  await logActivity({
    user: reg.customerName,
    action: "checked in at",
    event: reg.eventTitle,
  });

  return { success: true, registration: updated, message: "Check-in successful!" };
}

// ==========================================
// ACTIVITIES HELPERS
// ==========================================
export async function getAllActivities() {
  try {
    const db = await getDatabase();
    if (db) {
      const activities = await db.collection("activities").find({}).sort({ timestamp: -1 }).limit(50).toArray();
      if (activities && activities.length > 0) {
        return activities.map(({ _id, ...a }) => a);
      }
    }
  } catch (e) {
    console.warn("MongoDB getAllActivities fallback:", e.message);
  }

  await ensureFiles();
  try {
    const data = await fs.readFile(ACTIVITIES_FILE, "utf8");
    const acts = JSON.parse(data || "[]");
    globalThis.__eventify_activities = acts;
    return acts;
  } catch {
    return globalThis.__eventify_activities || SEED_ACTIVITIES;
  }
}

export async function logActivity({ user, action, event }) {
  const newAct = {
    id: "act_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    user: user || "Attendee",
    action: action || "interacted with",
    event: event || "Event",
    time: "Just now",
    timestamp: Date.now(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("activities").insertOne({ ...newAct });
    }
  } catch (e) {
    console.warn("MongoDB logActivity error:", e.message);
  }

  await ensureFiles();
  const activities = await getAllActivities();
  activities.unshift(newAct);
  const trimmed = activities.slice(0, 50);
  globalThis.__eventify_activities = trimmed;

  try {
    await fs.writeFile(ACTIVITIES_FILE, JSON.stringify(trimmed, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist activity:", err.message);
  }

  return newAct;
}

// ==========================================
// ORGANIZER SETTINGS HELPERS
// ==========================================
export async function getOrganizerSettings() {
  try {
    const db = await getDatabase();
    if (db) {
      const settings = await db.collection("settings").findOne({ type: "organizer" });
      if (settings) {
        const { _id, type, ...cleanSettings } = settings;
        return cleanSettings;
      }
    }
  } catch (e) {
    console.warn("MongoDB getOrganizerSettings fallback:", e.message);
  }

  await ensureFiles();
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf8");
    const settings = JSON.parse(data || "{}");
    globalThis.__eventify_settings = settings;
    return settings;
  } catch {
    return globalThis.__eventify_settings || SEED_SETTINGS;
  }
}

export async function updateOrganizerSettings(updates) {
  const current = await getOrganizerSettings();
  const merged = {
    ...current,
    ...updates,
    payoutMethods: {
      ...current.payoutMethods,
      ...(updates.payoutMethods || {}),
    },
    notifications: {
      ...current.notifications,
      ...(updates.notifications || {}),
    },
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("settings").updateOne(
        { type: "organizer" },
        { $set: { ...merged, type: "organizer" } },
        { upsert: true }
      );
    }
  } catch (e) {
    console.warn("MongoDB updateOrganizerSettings error:", e.message);
  }

  await ensureFiles();
  globalThis.__eventify_settings = merged;

  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not save settings:", err.message);
  }

  return merged;
}

// ==========================================
// NOTIFICATIONS HELPERS
// ==========================================
export async function getAllNotifications() {
  try {
    const db = await getDatabase();
    if (db) {
      const list = await db.collection("notifications").find({}).sort({ createdAt: -1 }).toArray();
      if (list && list.length > 0) {
        return list.map(({ _id, ...notif }) => notif);
      }
    }
  } catch (e) {
    console.warn("MongoDB getAllNotifications fallback:", e.message);
  }

  await ensureFiles();
  try {
    const data = await fs.readFile(NOTIFICATIONS_FILE, "utf8");
    const list = JSON.parse(data || "[]");
    globalThis.__eventify_notifications = list;
    return list;
  } catch {
    return globalThis.__eventify_notifications || SEED_NOTIFICATIONS;
  }
}

export async function getUserNotifications(userRole = "all", userEmail = "") {
  const all = await getAllNotifications();
  return all.filter((n) => {
    // If targeted directly to this user's email
    if (userEmail && n.recipientEmail && n.recipientEmail.toLowerCase() === userEmail.toLowerCase()) {
      return true;
    }
    // If broadcast to all users
    if (n.recipientRole === "all") return true;
    // If targeted to role (organizer or attendee)
    if (userRole && n.recipientRole === userRole) return true;
    return false;
  });
}

export async function createNotification({
  title,
  message,
  type = "system",
  recipientRole = "all",
  recipientEmail = null,
  link = null,
}) {
  const newNotif = {
    id: "notif_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    recipientRole,
    recipientEmail,
    title,
    message,
    type,
    link,
    read: false,
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("notifications").insertOne({ ...newNotif });
    }
  } catch (e) {
    console.warn("MongoDB createNotification error:", e.message);
  }

  await ensureFiles();
  const list = await getAllNotifications();
  list.unshift(newNotif);
  const trimmed = list.slice(0, 100);
  globalThis.__eventify_notifications = trimmed;

  try {
    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(trimmed, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not save notification:", err.message);
  }

  return newNotif;
}

export async function markNotificationAsRead(id) {
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("notifications").updateOne({ id }, { $set: { read: true } });
    }
  } catch (e) {
    console.warn("MongoDB markNotificationAsRead error:", e.message);
  }

  await ensureFiles();
  const list = await getAllNotifications();
  const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
  globalThis.__eventify_notifications = updated;

  try {
    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not update notification:", err.message);
  }

  return true;
}

export async function markAllNotificationsAsRead(userRole = "all", userEmail = "") {
  try {
    const db = await getDatabase();
    if (db) {
      const filter = {
        $or: [
          { recipientRole: userRole },
          { recipientRole: "all" },
          ...(userEmail ? [{ recipientEmail: userEmail }] : []),
        ],
      };
      await db.collection("notifications").updateMany(filter, { $set: { read: true } });
    }
  } catch (e) {
    console.warn("MongoDB markAllNotificationsAsRead error:", e.message);
  }

  await ensureFiles();
  const list = await getAllNotifications();
  const updated = list.map((n) => {
    const isTarget =
      n.recipientRole === "all" ||
      n.recipientRole === userRole ||
      (userEmail && n.recipientEmail?.toLowerCase() === userEmail.toLowerCase());
    return isTarget ? { ...n, read: true } : n;
  });
  globalThis.__eventify_notifications = updated;

  try {
    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not update all notifications:", err.message);
  }

  return true;
}

export async function deleteNotification(id) {
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("notifications").deleteOne({ id });
    }
  } catch (e) {
    console.warn("MongoDB deleteNotification error:", e.message);
  }

  await ensureFiles();
  const list = await getAllNotifications();
  const updated = list.filter((n) => n.id !== id);
  globalThis.__eventify_notifications = updated;

  try {
    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not delete notification:", err.message);
  }

  return true;
}

// ==========================================
// REVIEWS & PLATFORM STATS HELPERS
// ==========================================
export async function getAllReviews() {
  try {
    const db = await getDatabase();
    if (db) {
      const items = await db.collection("reviews").find({}).sort({ createdAt: -1 }).toArray();
      if (items && items.length > 0) {
        return items.map(({ _id, ...r }) => r);
      }
    }
  } catch (e) {
    console.warn("MongoDB getAllReviews error:", e.message);
  }

  await ensureFiles();
  if (globalThis.__eventify_reviews) return globalThis.__eventify_reviews;

  try {
    const data = await fs.readFile(REVIEWS_FILE, "utf8");
    const parsed = JSON.parse(data || "[]");
    globalThis.__eventify_reviews = parsed;
    return parsed;
  } catch (err) {
    globalThis.__eventify_reviews = SEED_REVIEWS;
    return SEED_REVIEWS;
  }
}

export async function createReview(data) {
  const newReview = {
    id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: data.name || "Event Attendee",
    role: data.role || "Verified Attendee",
    eventTitle: data.eventTitle || "Eventify Experience",
    rating: Number(data.rating) || 5,
    comment: data.comment || "Great experience with Eventify!",
    initials: (data.name || "EA").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
    avatarColor: ["bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-indigo-600", "bg-rose-600"][Math.floor(Math.random() * 5)],
    createdAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("reviews").insertOne(newReview);
    }
  } catch (e) {
    console.warn("MongoDB createReview error:", e.message);
  }

  await ensureFiles();
  const list = await getAllReviews();
  const updated = [newReview, ...list];
  globalThis.__eventify_reviews = updated;

  try {
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not save new review:", err.message);
  }

  return newReview;
}

export async function getPlatformStats() {
  const events = await getAllEvents();
  const registrations = await getAllRegistrations();
  const reviews = await getAllReviews();

  const eventsCount = events.length;
  const registrationsCount = registrations.length;
  const checkInsCount = registrations.filter(r => r.checkedIn).length;

  const totalRating = reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
  const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "4.9";

  return {
    eventsCount: eventsCount || 5,
    registrationsCount: registrationsCount || 2840,
    checkInsCount: checkInsCount || 1420,
    avgRating,
    satisfactionRate: "99.4%",
    totalReviews: reviews.length,
  };
}

// ==========================================
// TEAM ROLES & EVENT STAFF HELPERS
// ==========================================

export async function getAllTeamRoles() {
  try {
    const db = await getDatabase();
    if (db) {
      const roles = await db.collection("team_roles").find({}).sort({ createdAt: -1 }).toArray();
      if (roles && roles.length > 0) {
        return roles.map(({ _id, ...r }) => r);
      }
    }
  } catch (e) {
    console.warn("MongoDB getAllTeamRoles error:", e.message);
  }

  await ensureFiles();
  try {
    const data = await fs.readFile(TEAM_ROLES_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return globalThis.__eventify_team_roles || SEED_TEAM_ROLES;
  }
}

export async function createTeamRole(roleData) {
  const newRole = {
    id: "role_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    name: roleData.name?.trim() || "Team Member",
    email: roleData.email.trim().toLowerCase(),
    eventId: roleData.eventId,
    eventTitle: roleData.eventTitle || "Assigned Event",
    roleTitle: roleData.roleTitle || "Event Moderator",
    permissions: {
      canCheckIn: Boolean(roleData.permissions?.canCheckIn),
      canViewAttendees: Boolean(roleData.permissions?.canViewAttendees),
      canEditEvent: Boolean(roleData.permissions?.canEditEvent),
      canSendBroadcast: Boolean(roleData.permissions?.canSendBroadcast),
      canViewRevenue: Boolean(roleData.permissions?.canViewRevenue),
    },
    status: roleData.status || "Invited",
    invitedBy: roleData.invitedBy || "organizer",
    invitedByEmail: roleData.invitedByEmail || "",
    invitedByName: roleData.invitedByName || "Event Organizer",
    inviteToken: "inv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("team_roles").insertOne({ ...newRole });
    }
  } catch (e) {
    console.warn("MongoDB createTeamRole error:", e.message);
  }

  await ensureFiles();
  const current = await getAllTeamRoles();
  const updated = [newRole, ...current];
  globalThis.__eventify_team_roles = updated;

  try {
    await fs.writeFile(TEAM_ROLES_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not save team role to file:", err.message);
  }

  return newRole;
}

export async function updateTeamRole(id, updates) {
  const roles = await getAllTeamRoles();
  const idx = roles.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  roles[idx] = {
    ...roles[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("team_roles").updateOne({ id }, { $set: roles[idx] });
    }
  } catch (e) {
    console.warn("MongoDB updateTeamRole error:", e.message);
  }

  globalThis.__eventify_team_roles = roles;
  try {
    await fs.writeFile(TEAM_ROLES_FILE, JSON.stringify(roles, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not update team role file:", err.message);
  }

  return roles[idx];
}

export async function deleteTeamRole(id) {
  const roles = await getAllTeamRoles();
  const filtered = roles.filter((r) => r.id !== id);

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("team_roles").deleteOne({ id });
    }
  } catch (e) {
    console.warn("MongoDB deleteTeamRole error:", e.message);
  }

  globalThis.__eventify_team_roles = filtered;
  try {
    await fs.writeFile(TEAM_ROLES_FILE, JSON.stringify(filtered, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not delete team role file:", err.message);
  }

  return true;
}

export async function findTeamRolesByUserEmail(email) {
  if (!email) return [];
  const normalized = email.toLowerCase().trim();
  const roles = await getAllTeamRoles();
  return roles.filter((r) => r.email.toLowerCase() === normalized && r.status !== "Revoked");
}

export async function findTeamRoleForEventAndUser(eventId, userEmail) {
  if (!eventId || !userEmail) return null;
  const normalizedEmail = userEmail.toLowerCase().trim();
  const roles = await getAllTeamRoles();
  return roles.find(
    (r) =>
      r.email.toLowerCase() === normalizedEmail &&
      (String(r.eventId) === String(eventId) || r.eventId === "all") &&
      r.status !== "Revoked"
  ) || null;
}

