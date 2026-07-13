import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "partikarte")
  : path.join(__dirname, "..", ".data");

const STORE_FILE = path.join(DATA_DIR, "store.json");

const defaultStore = {
  users: {},
  admins: {},
  otps: {},
  sessions: {},
  roles: {},
};

function ensureStoreFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(defaultStore, null, 2), "utf8");
  }
}

export function readStore() {
  ensureStoreFile();
  const raw = fs.readFileSync(STORE_FILE, "utf8");
  return JSON.parse(raw || JSON.stringify(defaultStore));
}

export function writeStore(store) {
  ensureStoreFile();
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}

export function updateStore(updater) {
  const store = readStore();
  const nextStore = updater(store) || store;
  writeStore(nextStore);
  return nextStore;
}
