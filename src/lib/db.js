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

// In-Memory Global Fallback Cache for Serverless Lambdas
if (!globalThis.__eventify_users) {
  globalThis.__eventify_users = null;
}
if (!globalThis.__eventify_otps) {
  globalThis.__eventify_otps = {};
}

// Ensure directory and files exist with seed data migration
async function ensureFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Check/seed users.json
    try {
      await fs.access(USERS_FILE);
    } catch {
      let initialUsers = [];
      // Try to copy from bundled .data/users.json if available
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
  } catch (error) {
    // If filesystem write fails on serverless, fallback to in-memory store
    console.warn("Storage warning (falling back to memory):", error.message);
    if (!globalThis.__eventify_users) {
      try {
        const bundledUsers = await fs.readFile(
          path.join(BUNDLED_DATA_DIR, "users.json"),
          "utf8"
        );
        globalThis.__eventify_users = JSON.parse(bundledUsers || "[]");
      } catch {
        globalThis.__eventify_users = [];
      }
    }
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
    globalThis.__eventify_otps = otps;
    try {
      await fs.writeFile(OTPS_FILE, JSON.stringify(otps, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not delete OTP from file:", err.message);
    }
  }
}
