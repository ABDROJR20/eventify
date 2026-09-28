import fs from "fs/promises";
import path from "path";
import os from "os";

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

// User helper methods
export async function getAllUsers() {
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
  const users = await getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(id) {
  if (!id) return null;
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
  await ensureFiles();
  const users = await getAllUsers();

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const newUser = {
    id: "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
    name: name || email.split("@")[0],
    email: email.toLowerCase().trim(),
    password: password || null,
    role: role || "attendee", // 'attendee' | 'organizer' | 'admin'
    provider: provider || "credentials", // 'credentials' | 'google'
    image: image || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  globalThis.__eventify_users = users;

  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist to file, stored in memory cache:", err.message);
  }

  return newUser;
}

export async function updateUser(email, updates) {
  await ensureFiles();
  const users = await getAllUsers();
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

  if (index === -1) {
    throw new Error("User not found");
  }

  users[index] = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  globalThis.__eventify_users = users;

  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist to file, stored in memory cache:", err.message);
  }

  return users[index];
}

export async function updateUserPassword(email, newHashedPassword) {
  return updateUser(email, { password: newHashedPassword });
}

// OTP Store Methods
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
  await ensureFiles();
  const otps = await getAllOtps();
  const normalizedEmail = email.toLowerCase().trim();

  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  otps[normalizedEmail] = {
    otp: String(otp).trim(),
    expiresAt,
    createdAt: Date.now(),
  };

  globalThis.__eventify_otps = otps;

  try {
    await fs.writeFile(OTPS_FILE, JSON.stringify(otps, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist OTP to file, stored in memory cache:", err.message);
  }

  return otps[normalizedEmail];
}

export async function getOtp(email) {
  await ensureFiles();
  const otps = await getAllOtps();
  const record = otps[email.toLowerCase().trim()];
  if (!record) return null;

  if (Date.now() > record.expiresAt) {
    await deleteOtp(email);
    return null;
  }

  return record;
}

export async function deleteOtp(email) {
  await ensureFiles();
  const otps = await getAllOtps();
  const normalizedEmail = email.toLowerCase().trim();
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
  await ensureFiles();
  const events = await getAllEvents();

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
    status: eventData.status || "Draft", // Published | Draft | Past
    featured: Boolean(eventData.featured),
    ticketsSold: 0,
    revenue: 0,
    description: eventData.description || "",
    speakers: Array.isArray(eventData.speakers) ? eventData.speakers : (eventData.speakers ? [eventData.speakers] : []),
    organizerId: eventData.organizerId || "org_default",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  events.unshift(newEvent);
  globalThis.__eventify_events = events;

  try {
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist event to file:", err.message);
  }

  // Log activity
  await logActivity({
    user: "Organizer",
    action: "created event",
    event: newEvent.title,
  });

  return newEvent;
}

export async function updateEvent(id, updates) {
  await ensureFiles();
  const events = await getAllEvents();
  const index = events.findIndex((e) => String(e.id) === String(id));

  if (index === -1) {
    throw new Error("Event not found");
  }

  const updatedPrice = updates.price !== undefined ? Number(updates.price) : events[index].price;
  const updatedPriceDisplay = updatedPrice > 0 ? `PKR ${updatedPrice.toFixed(2)}` : "Free";

  events[index] = {
    ...events[index],
    ...updates,
    price: updatedPrice,
    priceDisplay: updates.priceDisplay || updatedPriceDisplay,
    updatedAt: new Date().toISOString(),
  };

  globalThis.__eventify_events = events;

  try {
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist event updates:", err.message);
  }

  return events[index];
}

export async function deleteEvent(id) {
  await ensureFiles();
  const events = await getAllEvents();
  const filtered = events.filter((e) => String(e.id) !== String(id));

  if (filtered.length === events.length) {
    throw new Error("Event not found");
  }

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
  await ensureFiles();
  const attendees = await getAllAttendees();

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
  await ensureFiles();
  const attendees = await getAllAttendees();
  const index = attendees.findIndex((a) => String(a.id) === String(id));

  if (index === -1) {
    throw new Error("Attendee not found");
  }

  attendees[index] = {
    ...attendees[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  globalThis.__eventify_attendees = attendees;

  try {
    await fs.writeFile(ATTENDEES_FILE, JSON.stringify(attendees, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not update attendee:", err.message);
  }

  return attendees[index];
}

export async function deleteAttendee(id) {
  await ensureFiles();
  const attendees = await getAllAttendees();
  const filtered = attendees.filter((a) => String(a.id) !== String(id));

  globalThis.__eventify_attendees = filtered;

  try {
    await fs.writeFile(ATTENDEES_FILE, JSON.stringify(filtered, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not delete attendee:", err.message);
  }

  return { success: true, id };
}

// ==========================================
// REGISTRATIONS & ORDERS HELPERS
// ==========================================
export async function getAllRegistrations() {
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
  await ensureFiles();
  const registrations = await getAllRegistrations();

  const idNum = Math.floor(100 + Math.random() * 900);
  const newReg = {
    id: data.id || `#ORD-${idNum}`,
    eventId: data.eventId || "evt_1",
    eventTitle: data.eventTitle || "Global Tech Summit 2026",
    customerName: data.customerName || "Attendee",
    customerEmail: (data.customerEmail || "").toLowerCase().trim(),
    customerPhone: data.customerPhone || "",
    ticketType: data.ticketType || "Standard",
    ticketCount: Number(data.ticketCount) || 1,
    amount: Number(data.amount) || 0,
    amountDisplay: `$${(Number(data.amount) || 0).toFixed(2)}`,
    status: data.status || "Completed",
    checkedIn: Boolean(data.checkedIn),
    checkedInAt: data.checkedIn ? new Date().toISOString() : null,
    ticketCode: data.ticketCode || `EVT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };

  registrations.unshift(newReg);
  globalThis.__eventify_registrations = registrations;

  try {
    await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist registration:", err.message);
  }

  // Log activity
  await logActivity({
    user: newReg.customerName,
    action: "registered for",
    event: newReg.eventTitle,
  });

  return newReg;
}

export async function updateRegistration(id, updates) {
  await ensureFiles();
  const registrations = await getAllRegistrations();
  const index = registrations.findIndex((r) => String(r.id) === String(id));

  if (index === -1) {
    throw new Error("Registration not found");
  }

  registrations[index] = {
    ...registrations[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  globalThis.__eventify_registrations = registrations;

  try {
    await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not update registration:", err.message);
  }

  return registrations[index];
}

export async function checkInTicket(query) {
  await ensureFiles();
  const registrations = await getAllRegistrations();
  const trimmed = String(query).trim().toLowerCase();

  const reg = registrations.find(
    (r) =>
      r.ticketCode.toLowerCase() === trimmed ||
      r.id.toLowerCase() === trimmed ||
      r.customerEmail.toLowerCase() === trimmed
  );

  if (!reg) {
    return { success: false, message: "Ticket / Registration not found." };
  }

  if (reg.checkedIn) {
    return {
      success: false,
      alreadyCheckedIn: true,
      registration: reg,
      message: `Already checked in at ${new Date(reg.checkedInAt).toLocaleTimeString()}`,
    };
  }

  reg.checkedIn = true;
  reg.checkedInAt = new Date().toISOString();
  reg.status = "Checked In";
  globalThis.__eventify_registrations = registrations;

  try {
    await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist checkin:", err.message);
  }

  // Log activity
  await logActivity({
    user: reg.customerName,
    action: "checked in at",
    event: reg.eventTitle,
  });

  return { success: true, registration: reg, message: "Check-in successful!" };
}

// ==========================================
// ACTIVITIES HELPERS
// ==========================================
export async function getAllActivities() {
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
  await ensureFiles();
  const activities = await getAllActivities();

  const newAct = {
    id: "act_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    user: user || "Attendee",
    action: action || "interacted with",
    event: event || "Event",
    time: "Just now",
    timestamp: Date.now(),
  };

  activities.unshift(newAct);
  // Keep last 50 activities
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
  await ensureFiles();
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

  globalThis.__eventify_settings = merged;

  try {
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not save settings:", err.message);
  }

  return merged;
}

