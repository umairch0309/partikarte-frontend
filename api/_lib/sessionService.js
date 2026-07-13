import crypto from "node:crypto";
import { ApiError } from "./errors.js";
import { readStore, updateStore } from "./store.js";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createSession({ email, role, scope, permissions }) {
  const token = crypto.randomBytes(32).toString("hex");

  updateStore((store) => {
    store.sessions = store.sessions || {};
    store.sessions[token] = {
      email,
      role,
      scope,
      permissions,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    return store;
  });

  return token;
}

export function validateSession(token) {
  if (!token) {
    throw new ApiError("Invalid token", 401);
  }

  const store = readStore();
  const session = store.sessions?.[token];

  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      updateStore((nextStore) => {
        delete nextStore.sessions[token];
        return nextStore;
      });
    }
    throw new ApiError("Invalid token", 401);
  }

  return session;
}

export function getBearerToken(authorizationHeader = "") {
  const [scheme, token] = String(authorizationHeader).split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token;
}
