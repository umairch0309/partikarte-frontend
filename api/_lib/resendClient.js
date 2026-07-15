import { Resend } from "resend";

export function getResendClient(env = process.env) {
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(apiKey);
}

export function getFromEmail(env = process.env) {
  return env.RESEND_FROM_EMAIL || "Partikarte <info@partikarte.si>";
}
