import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const OTPS_FILE = path.join(DATA_DIR, "otps.json");

// Ensure directory and files exist
async function ensureFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), "utf8");
    }
    try {
      await fs.access(OTPS_FILE);
    } catch {
      await fs.writeFile(OTPS_FILE, JSON.stringify({}, null, 2), "utf8");
    }
  } catch (error) {
    console.error("Error initializing database storage:", error);
  }
}

// User helper methods
export async function getAllUsers() {
  await ensureFiles();
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
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

export async function createUser({ name, email, password, role = "attendee", provider = "credentials", image = null }) {
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
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
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

  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
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
    return JSON.parse(data || "{}");
  } catch {
    return {};
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

  await fs.writeFile(OTPS_FILE, JSON.stringify(otps, null, 2), "utf8");
  return otps[normalizedEmail];
}

export async function getOtp(email) {
  await ensureFiles();
  const otps = await getAllOtps();
  const record = otps[email.toLowerCase().trim()];
  if (!record) return null;

  // Check expiration
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
    await fs.writeFile(OTPS_FILE, JSON.stringify(otps, null, 2), "utf8");
  }
}
