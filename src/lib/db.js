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

// In-Memory Global Fallback Cache for Serverless Lambdas
if (!globalThis.__eventify_users) globalThis.__eventify_users = null;
if (!globalThis.__eventify_otps) globalThis.__eventify_otps = {};
if (!globalThis.__eventify_events) globalThis.__eventify_events = null;
if (!globalThis.__eventify_registrations) globalThis.__eventify_registrations = null;
if (!globalThis.__eventify_attendees) globalThis.__eventify_attendees = null;
if (!globalThis.__eventify_activities) globalThis.__eventify_activities = null;
if (!globalThis.__eventify_settings) globalThis.__eventify_settings = null;

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
  organizerName: "Aadrish Pirzado",
  companyName: "Eventify Innovations",
  email: "aadrish@example.com",
  phone: "+92 300 9876543",
  bio: "Lead event producer organizing elite tech, design, and developer experiences worldwide.",
  website: "https://eventify.pk",
  avatarUrl: "https://i.pravatar.cc/150?u=organizer",
  payoutMethods: {
    bankAccount: {
      accountTitle: "Aadrish Pirzado",
      bankName: "Habib Bank Limited (HBL)",
      accountNumber: "PK36HABB0001234567890123",
      isDefault: true
    },
    jazzCash: {
      accountNumber: "+92 300 9876543",
      accountName: "Aadrish Pirzado",
      isDefault: false
    },
    easyPaisa: {
      accountNumber: "+92 300 9876543",
      accountName: "Aadrish Pirzado",
      isDefault: false
    }
  },
  notifications: {
    emailOnNewTicket: true,
    emailOnCheckIn: false,
    dailySummary: true,
    smsAlerts: false
  }
};

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
  } catch (error) {
    console.warn("Storage warning (falling back to memory):", error.message);
    if (!globalThis.__eventify_users) globalThis.__eventify_users = [];
    if (!globalThis.__eventify_events) globalThis.__eventify_events = SEED_EVENTS;
    if (!globalThis.__eventify_attendees) globalThis.__eventify_attendees = SEED_ATTENDEES;
    if (!globalThis.__eventify_registrations) globalThis.__eventify_registrations = SEED_REGISTRATIONS;
    if (!globalThis.__eventify_activities) globalThis.__eventify_activities = SEED_ACTIVITIES;
    if (!globalThis.__eventify_settings) globalThis.__eventify_settings = SEED_SETTINGS;
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
    featured: Boolean(eventData.featured),
    ticketsSold: 0,
    revenue: 0,
    description: eventData.description || "",
    speakers: Array.isArray(eventData.speakers) ? eventData.speakers : (eventData.speakers ? [eventData.speakers] : []),
    organizerId: eventData.organizerId || "org_default",
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
