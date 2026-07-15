import { getFromEmail, getResendClient } from "./resendClient.js";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildContactEmailHtml({
  firstName,
  lastName,
  email,
  phoneNumber,
  object,
  description,
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #171717; line-height: 1.6;">
      <h2 style="margin-bottom: 16px;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phoneNumber)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(object)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(description).replace(/\n/g, "<br>")}</p>
    </div>
  `;
}

function buildContactConfirmationHtml({ firstName, object }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #171717; line-height: 1.6;">
      <h2 style="margin-bottom: 16px;">We received your message</h2>
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Thank you for contacting Partikarte about <strong>${escapeHtml(object)}</strong>.</p>
      <p>Our team will review your request and get back to you within 24 hours.</p>
      <p style="margin-top: 24px;">Best regards,<br />The Partikarte Team</p>
    </div>
  `;
}

function buildOtpEmailHtml({ otp, purpose }) {
  const title =
    purpose === "reset" ? "Reset your Partikarte password" : "Verify your Partikarte account";

  const description =
    purpose === "reset"
      ? "Use the code below to reset your password. This code expires in 10 minutes."
      : "Use the code below to verify your email address. This code expires in 10 minutes.";

  return `
    <div style="font-family: Arial, sans-serif; color: #171717; line-height: 1.6;">
      <h2 style="margin-bottom: 16px;">${title}</h2>
      <p>${description}</p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 24px 0;">${escapeHtml(otp)}</p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p style="margin-top: 24px;">Best regards,<br />The Partikarte Team</p>
    </div>
  `;
}

async function sendEmail({ to, subject, html }, env = process.env) {
  const resend = getResendClient(env);
  const from = getFromEmail(env);
  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
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
    attachments: resendAttachments,
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
