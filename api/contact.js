import { createHandler } from "./_lib/createHandler.js";
import { sendContactEmail } from "./_lib/emailService.js";
import { ApiError } from "./_lib/errors.js";

export default createHandler(async (body, env) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    object,
    description,
    attachments = [],
  } = body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !object ||
    !description
  ) {
    throw new ApiError("Missing required fields", 400);
  }

  await sendContactEmail(
    {
      firstName,
      lastName,
      email,
      phoneNumber,
      object,
      description,
      attachments,
    },
    env
  );

  return { message: "Your message has been sent successfully" };
});
