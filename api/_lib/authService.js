import crypto from "node:crypto";
import { ApiError } from "./errors.js";
import { sendOtpEmail } from "./emailService.js";
import { hashPassword, verifyPassword } from "./password.js";
import { getAdminPermissions, getBusinessPermissions } from "./permissions.js";
import { readStore, updateStore } from "./store.js";
import { createSession } from "./sessionService.js";

const OTP_TTL_MS = 10 * 60 * 1000;

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

function getCollectionKey(scope) {
  return scope === "admin" ? "admins" : "users";
}

function getOtpKey(email, scope) {
  return `${scope}:${email}`;
}

function saveOtp(store, email, scope, purpose, otp) {
  const otpKey = getOtpKey(email, scope);
  store.otps[otpKey] = {
    otp,
    purpose,
    scope,
    email,
    expiresAt: Date.now() + OTP_TTL_MS,
    verified: false,
  };
}

function getOtpRecord(store, email, scope) {
  return store.otps[getOtpKey(email, scope)] || null;
}

function assertOtpRecord(record) {
  if (!record) {
    throw new ApiError("OTP not found. Please request a new code.", 400);
  }

  if (Date.now() > record.expiresAt) {
    throw new ApiError("OTP has expired. Please request a new code.", 400);
  }
}

function isDevFallbackAllowed(env) {
  return (
    env.DEV_LOG_OTP === "true" || env.NODE_ENV === "development" || !env.VERCEL
  );
}

/**
 * Issues a fresh OTP, persists it, and attempts delivery via Resend.
 *
 * Resend accounts without a verified domain can only deliver to the
 * account owner's own address (sandbox mode). When that restriction (or any
 * other delivery failure) is hit in a non-production environment, we still
 * log the code to the server console and return it as `debugOtp` so local
 * development and QA are never blocked on email delivery. In production
 * (Vercel with no DEV_LOG_OTP override) the error is rethrown so the
 * failure is visible and not silently swallowed.
 */
async function issueOtp(email, scope, purpose, env) {
  const normalizedEmail = normalizeEmail(email);
  const otp = generateOtp();

  updateStore((store) => {
    saveOtp(store, normalizedEmail, scope, purpose, otp);
    return store;
  });

  try {
    await sendOtpEmail({ email: normalizedEmail, otp, purpose }, env);
    return { delivered: true };
  } catch (error) {
    if (!isDevFallbackAllowed(env)) {
      throw error;
    }

    console.warn(
      `[Partikarte OTP] Email delivery failed (${error.message}). ` +
        `Falling back to console for ${scope}/${purpose}/${normalizedEmail}: ${otp}`
    );

    return { delivered: false, debugOtp: otp };
  }
}

export async function forgotPassword({ email }, scope = "business", env = process.env) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new ApiError("Email is required", 400);
  }

  const store = readStore();
  const collectionKey = getCollectionKey(scope);
  const account = store[collectionKey][normalizedEmail];

  if (!account) {
    throw new ApiError("No account found with this email address", 404);
  }

  const { debugOtp } = await issueOtp(normalizedEmail, scope, "reset", env);

  return {
    message: "OTP sent to your email address",
    ...(debugOtp && { debugOtp }),
  };
}

export async function resendVerificationOtp(
  { email },
  scope = "business",
  env = process.env
) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new ApiError("Email is required", 400);
  }

  const store = readStore();
  const collectionKey = getCollectionKey(scope);
  const account = store[collectionKey][normalizedEmail];

  if (!account) {
    throw new ApiError("No account found with this email address", 404);
  }

  if (account.verified) {
    throw new ApiError("This account is already verified", 400);
  }

  const { debugOtp } = await issueOtp(normalizedEmail, scope, "verify", env);

  return {
    message: "A new OTP has been sent to your email address",
    ...(debugOtp && { debugOtp }),
  };
}

export async function verifyOtp({ email, otp }, scope = "business") {
  const normalizedEmail = normalizeEmail(email);
  const normalizedOtp = String(otp || "").trim();

  if (!normalizedEmail || !normalizedOtp) {
    throw new ApiError("Email and OTP are required", 400);
  }

  const store = readStore();
  const record = getOtpRecord(store, normalizedEmail, scope);
  assertOtpRecord(record);

  if (record.otp !== normalizedOtp) {
    throw new ApiError("Invalid OTP", 400);
  }

  updateStore((nextStore) => {
    const otpRecord = getOtpRecord(nextStore, normalizedEmail, scope);
    otpRecord.verified = true;

    if (otpRecord.purpose === "verify") {
      const collectionKey = getCollectionKey(scope);
      if (nextStore[collectionKey][normalizedEmail]) {
        nextStore[collectionKey][normalizedEmail].verified = true;
      }
    }

    return nextStore;
  });

  const verifyEmailRequested = record.purpose === "verify";

  return {
    message: verifyEmailRequested
      ? "Email verified successfully"
      : "OTP verified successfully",
    data: {
      verifyEmailRequested,
    },
  };
}

export async function resetPassword(
  { email, password, confirmPassword },
  scope = "business"
) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password || !confirmPassword) {
    throw new ApiError("All fields are required", 400);
  }

  if (password !== confirmPassword) {
    throw new ApiError("Passwords do not match", 400);
  }

  if (password.length < 6) {
    throw new ApiError("Password must be at least 6 characters", 400);
  }

  const store = readStore();
  const record = getOtpRecord(store, normalizedEmail, scope);
  assertOtpRecord(record);

  if (!record.verified || record.purpose !== "reset") {
    throw new ApiError("Please verify your OTP before resetting password", 400);
  }

  const collectionKey = getCollectionKey(scope);
  const account = store[collectionKey][normalizedEmail];

  if (!account) {
    throw new ApiError("Account not found", 404);
  }

  const { hash, salt } = hashPassword(password);

  updateStore((nextStore) => {
    nextStore[collectionKey][normalizedEmail].passwordHash = hash;
    nextStore[collectionKey][normalizedEmail].salt = salt;
    delete nextStore.otps[getOtpKey(normalizedEmail, scope)];
    return nextStore;
  });

  return {
    message: "Password reset successfully",
  };
}

export async function registerBusinessUser(payload, env = process.env) {
  const email = normalizeEmail(payload?.email);
  const password = payload?.password;

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const store = readStore();
  const existing = store.users[email];

  if (existing?.verified) {
    throw new ApiError("An account with this email already exists", 409);
  }

  const { hash, salt } = hashPassword(password);

  updateStore((nextStore) => {
    nextStore.users[email] = {
      email,
      passwordHash: hash,
      salt,
      role: "business",
      verified: false,
      profile: {
        username: payload?.username || "",
        companyName: payload?.companyName || "",
        companyVAT: payload?.companyVAT || "",
        companyRegistryNumber: payload?.companyRegistryNumber || "",
        addressDescription: payload?.addressDescription || "",
        city: payload?.city || "",
        postalCode: payload?.postalCode || "",
        country: payload?.country || "",
      },
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    return nextStore;
  });

  const { debugOtp } = await issueOtp(email, "business", "verify", env);

  return {
    message: "Account created. Please verify your email with the OTP sent.",
    ...(debugOtp && { debugOtp }),
  };
}

export async function registerAdminUser(payload, env = process.env) {
  const email = normalizeEmail(payload?.email);
  const password = payload?.password;

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const store = readStore();
  const existing = store.admins[email];

  if (existing?.verified) {
    throw new ApiError("An admin account with this email already exists", 409);
  }

  const { hash, salt } = hashPassword(password);

  updateStore((nextStore) => {
    nextStore.admins[email] = {
      email,
      passwordHash: hash,
      salt,
      role: "admin",
      verified: false,
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    return nextStore;
  });

  const { debugOtp } = await issueOtp(email, "admin", "verify", env);

  return {
    message: "Admin account created. Please verify your email with the OTP sent.",
    ...(debugOtp && { debugOtp }),
  };
}

export async function loginUser({ email, password }, scope = "business", env = process.env) {
  const normalizedEmail = normalizeEmail(email);
  const collectionKey = getCollectionKey(scope);
  const store = readStore();
  const account = store[collectionKey][normalizedEmail];

  if (!account || !verifyPassword(password, account.passwordHash, account.salt)) {
    throw new ApiError("Incorrect email or password", 401);
  }

  if (!account.verified) {
    const { debugOtp } = await issueOtp(normalizedEmail, scope, "verify", env);
    throw new ApiError("Please verify your email. A new OTP has been sent.", 403, {
      verifyEmailRequested: true,
      ...(debugOtp && { debugOtp }),
    });
  }

  const permissions =
    scope === "admin" ? getAdminPermissions() : getBusinessPermissions();

  const token = createSession({
    email: normalizedEmail,
    role: account.role,
    scope,
    permissions,
  });

  return {
    message: "Login successful",
    data: {
      token,
      role: account.role,
      permissions,
    },
  };
}

export async function ensureSeedAccounts(env = process.env) {
  const store = readStore();
  const seedAdminEmail = normalizeEmail(env.SEED_ADMIN_EMAIL || "admin@partikarte.com");
  const seedBusinessEmail = normalizeEmail(
    env.SEED_BUSINESS_EMAIL || "business@partikarte.com"
  );
  const seedPassword = env.SEED_DEFAULT_PASSWORD || "Password@123";

  let changed = false;

  if (!store.admins[seedAdminEmail]) {
    const { hash, salt } = hashPassword(seedPassword);
    store.admins[seedAdminEmail] = {
      email: seedAdminEmail,
      passwordHash: hash,
      salt,
      role: "admin",
      verified: true,
      createdAt: new Date().toISOString(),
    };
    changed = true;
  }

  if (!store.users[seedBusinessEmail]) {
    const { hash, salt } = hashPassword(seedPassword);
    store.users[seedBusinessEmail] = {
      email: seedBusinessEmail,
      passwordHash: hash,
      salt,
      role: "business",
      verified: true,
      profile: {
        companyName: "Demo Business",
      },
      createdAt: new Date().toISOString(),
    };
    changed = true;
  }

  if (changed) {
    updateStore(() => store);
  }
}
