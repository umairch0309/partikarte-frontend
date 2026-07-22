import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getFromEmail, getResendClient } from "./resendClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRAND_LOGO_CID = "partikarte-logo";
const LOGO_CANDIDATES = [
  "partikarte-logo-white.png",
  "partikarte-logo.png",
];

function getLogoAttachment() {
  for (const name of LOGO_CANDIDATES) {
    const logoPath = path.join(__dirname, name);
    if (fs.existsSync(logoPath)) {
      return {
        filename: name,
        content: fs.readFileSync(logoPath).toString("base64"),
        contentType: "image/png",
        contentId: BRAND_LOGO_CID,
      };
    }
  }
  return null;
}

function resolveLogoUrl() {
  if (process.env.BRAND_LOGO_URL) return process.env.BRAND_LOGO_URL;
  return `cid:${BRAND_LOGO_CID}`;
}

const LOGO_URL = resolveLogoUrl();
const FONT = "'Outfit', Arial, Helvetica, sans-serif";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatOtpExpiry(minutes = 10) {
  const date = new Date(Date.now() + minutes * 60 * 1000);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function wrapPartikarteEmail({ eyebrow, title, bodyHtml }) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background-color:#f0f4fa;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4fa;width:100%;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8eef6;">
            <tr>
              <td align="center" style="background-color:#3d8aff;padding:28px 24px;">
                <img src="${LOGO_URL}" alt="Partikarte" width="200" style="width:200px;max-width:80%;height:auto;border:0;display:block;margin:0 auto;" />
              </td>
            </tr>
            <tr>
              <td style="background-color:#ffffff;padding:32px 28px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${
                    eyebrow
                      ? `<tr><td align="center" style="padding-bottom:8px;font-family:${FONT};color:#3d8aff;font-size:13px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;">${escapeHtml(eyebrow)}</td></tr>`
                      : ""
                  }
                  <tr>
                    <td align="center" style="padding-bottom:16px;font-family:${FONT};color:#0e2d5d;font-size:24px;font-weight:700;line-height:1.3;">
                      ${escapeHtml(title)}
                    </td>
                  </tr>
                  ${bodyHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color:#ffffff;padding:8px 28px 28px;font-family:${FONT};color:#5b6b86;font-size:14px;line-height:1.6;">
                Regards,<br />
                <strong style="color:#0e2d5d;font-size:15px;">Partikarte</strong>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color:#eaf2ff;padding:18px 24px;font-family:${FONT};color:#0e2d5d;font-size:12px;line-height:1.55;border-top:1px solid #e8eef6;">
                You're receiving this email because you have an account with Partikarte.<br />
                If you didn't request this email, please contact our support.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildContactEmailHtml({
  firstName,
  lastName,
  email,
  phoneNumber,
  object,
  description,
}) {
  return wrapPartikarteEmail({
    eyebrow: "Contact",
    title: "New Contact Message",
    bodyHtml: `
      <tr>
        <td align="center" style="padding-bottom:20px;font-family:${FONT};color:#5b6b86;font-size:15px;line-height:1.6;">
          Partikarte received a new contact form submission.
        </td>
      </tr>
      <tr>
        <td align="left" style="padding:16px 18px;background-color:#eaf2ff;border-radius:12px;font-family:${FONT};color:#1d1e25;font-size:14px;line-height:1.7;">
          <strong style="color:#3d8aff;">Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}<br />
          <strong style="color:#3d8aff;">Email:</strong> ${escapeHtml(email)}<br />
          <strong style="color:#3d8aff;">Phone:</strong> ${escapeHtml(phoneNumber)}<br />
          <strong style="color:#3d8aff;">Subject:</strong> ${escapeHtml(object)}<br />
          <strong style="color:#3d8aff;">Message:</strong><br />
          ${escapeHtml(description).replace(/\n/g, "<br>")}
        </td>
      </tr>
    `,
  });
}

function buildContactConfirmationHtml({ firstName, object }) {
  return wrapPartikarteEmail({
    eyebrow: "Contact",
    title: "We Received Your Message",
    bodyHtml: `
      <tr>
        <td align="center" style="padding-bottom:16px;font-family:${FONT};color:#5b6b86;font-size:15px;line-height:1.6;">
          Hi ${escapeHtml(firstName)}, thank you for contacting Partikarte about
          <strong style="color:#0e2d5d;">${escapeHtml(object)}</strong>. Our team will get back to you within 24 hours.
        </td>
      </tr>
    `,
  });
}

function buildOtpEmailHtml({ otp, purpose }) {
  const isReset = purpose === "reset";
  const title = isReset ? "Password Reset Code" : "Email Verification Code";
  const eyebrow = isReset ? "Security" : "Verification";
  const description = isReset
    ? "Use the following One-Time Password (OTP) to reset your password:"
    : "Use the following One-Time Password (OTP) to verify your email address:";
  const expiresAt = formatOtpExpiry(10);

  return wrapPartikarteEmail({
    eyebrow,
    title,
    bodyHtml: `
      <tr>
        <td align="center" style="padding-bottom:20px;font-family:${FONT};color:#5b6b86;font-size:15px;line-height:1.6;">
          ${description}
        </td>
      </tr>
      <tr>
        <td align="center" style="padding-bottom:20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:#eaf2ff;border-radius:12px;margin:0 auto;">
            <tr>
              <td align="center" style="padding:18px 28px;font-family:${FONT};color:#3d8aff;font-size:36px;font-weight:700;letter-spacing:8px;line-height:1.2;">
                ${escapeHtml(otp)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding-bottom:12px;font-family:${FONT};color:#1d1e25;font-size:14px;line-height:1.6;">
          This code will expire at <strong style="color:#0e2d5d;">${escapeHtml(expiresAt)}</strong>.
        </td>
      </tr>
      <tr>
        <td align="center" style="padding-bottom:8px;font-family:${FONT};color:#5b6b86;font-size:13px;line-height:1.6;">
          Please do not share this code with anyone.
        </td>
      </tr>
    `,
  });
}

function withInlineLogo(attachments = []) {
  const logo = getLogoAttachment();
  if (!logo || process.env.BRAND_LOGO_URL) return attachments || [];
  const rest = (attachments || []).filter((a) => a?.contentId !== BRAND_LOGO_CID);
  return [logo, ...rest];
}

async function sendEmail({ to, subject, html, attachments = [] }, env = process.env) {
  const resend = getResendClient(env);
  const from = getFromEmail(env);
  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    attachments: withInlineLogo(attachments),
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }

  return data;
}

export async function sendContactEmail(payload, env = process.env) {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    object,
    description,
    attachments = [],
  } = payload;

  const to = env.CONTACT_TO_EMAIL || "info@partikarte.si";
  const resendAttachments = attachments
    .filter((attachment) => attachment?.filename && attachment?.content)
    .map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
    }));

  const resend = getResendClient(env);
  const from = getFromEmail(env);

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `[Partikarte Contact] ${object}`,
    html: buildContactEmailHtml({
      firstName,
      lastName,
      email,
      phoneNumber,
      object,
      description,
    }),
    attachments: withInlineLogo(resendAttachments),
  });

  if (error) {
    throw new Error(error.message || "Failed to send contact email");
  }

  await sendEmail(
    {
      to: email,
      subject: "We received your message - Partikarte",
      html: buildContactConfirmationHtml({ firstName, object }),
    },
    env
  );

  return data;
}

export async function sendOtpEmail({ email, otp, purpose }, env = process.env) {
  const subject =
    purpose === "reset"
      ? "Your Partikarte password reset code"
      : "Your Partikarte verification code";

  return sendEmail(
    {
      to: email,
      subject,
      html: buildOtpEmailHtml({ otp, purpose }),
    },
    env
  );
}
