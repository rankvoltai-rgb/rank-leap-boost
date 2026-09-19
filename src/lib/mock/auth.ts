/**
 * Local auth for mock mode (VITE_MOCK_DATA=1).
 *
 * Accounts and the session live in this browser's localStorage, so sign-up,
 * sign-in, social sign-in, sign-out and the dashboard guard all work with no
 * Supabase project. Nothing here leaves the browser.
 *
 * Passwords are stored as a non-cryptographic hash purely so a typed password
 * never sits in storage as plain text. It is not security — use throwaway
 * passwords.
 */
import { MOCK_USER_EMAIL, MOCK_USER_NAME } from "./fixtures";

const USERS_KEY = "rankvolt.mock.auth.users";
const SESSION_KEY = "rankvolt.mock.auth.session";

/** Pre-created account whose data is seeded on first sign-in. */
export const DEMO_EMAIL = MOCK_USER_EMAIL;
export const DEMO_PASSWORD = "demo1234";

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
}

interface StoredUser extends MockUser {
  passwordHash: string | null;
  provider: "password" | "google" | "apple";
  createdAt: string;
}

/** FNV-1a. Synchronous, so it also works off localhost where crypto.subtle is unavailable. */
function hash(value: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — the session just won't survive a refresh */
  }
}

function loadUsers(): StoredUser[] {
  const users = read<StoredUser[]>(USERS_KEY, []);
  if (!users.some((u) => u.email === DEMO_EMAIL)) {
    users.push({
      id: "mock-user-demo",
      email: DEMO_EMAIL,
      fullName: MOCK_USER_NAME,
      passwordHash: hash(DEMO_PASSWORD),
      provider: "password",
      createdAt: new Date().toISOString(),
    });
    write(USERS_KEY, users);
  }
  return users;
}

function toPublic(u: StoredUser): MockUser {
  return { id: u.id, email: u.email, fullName: u.fullName };
}

function startSession(u: StoredUser): MockUser {
  write(SESSION_KEY, { userId: u.id });
  return toPublic(u);
}

/** Simulated latency so button loading states are visible. */
function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getSessionUser(): MockUser | null {
  const session = read<{ userId: string } | null>(SESSION_KEY, null);
  if (!session) return null;
  const user = loadUsers().find((u) => u.id === session.userId);
  return user ? toPublic(user) : null;
}

export async function signUp(input: {
  email: string;
  password: string;
  fullName: string;
}): Promise<MockUser> {
  const email = normalizeEmail(input.email);
  // Messages match Supabase's, so the form reads the same in both modes.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw new Error("Unable to validate email address: invalid format");
  }
  if (input.password.length < 6) {
    throw new Error("Password should be at least 6 characters.");
  }
  const users = loadUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error("User already registered");
  }
  const user: StoredUser = {
    id: `mock-user-${Math.random().toString(36).slice(2, 10)}`,
    email,
    fullName: input.fullName.trim(),
    passwordHash: hash(input.password),
    provider: "password",
    createdAt: new Date().toISOString(),
  };
  write(USERS_KEY, [...users, user]);
  return delay(startSession(user));
}

export async function signIn(input: { email: string; password: string }): Promise<MockUser> {
  const email = normalizeEmail(input.email);
  const user = loadUsers().find((u) => u.email === email);
  if (!user || user.passwordHash !== hash(input.password)) {
    await delay(undefined);
    throw new Error("Invalid login credentials");
  }
  return delay(startSession(user));
}

/** Stands in for the Google/Apple OAuth round trip: one local account per provider. */
export async function signInWithProvider(provider: "google" | "apple"): Promise<MockUser> {
  const email = `${provider}.user@example.com`;
  const users = loadUsers();
  let user = users.find((u) => u.email === email);
  if (!user) {
    user = {
      id: `mock-user-${provider}`,
      email,
      fullName: provider === "google" ? "Google User" : "Apple User",
      passwordHash: null,
      provider,
      createdAt: new Date().toISOString(),
    };
    write(USERS_KEY, [...users, user]);
  }
  return delay(startSession(user), 700);
}

export async function signOut(): Promise<void> {
  write(SESSION_KEY, null);
  return delay(undefined, 150);
}
