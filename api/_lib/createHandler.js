import { ensureSeedAccounts } from "./authService.js";
import { ApiError } from "./errors.js";

export function createHandler(handler, options = {}) {
  const methods = options.methods || ["POST"];

  return async (req, res) => {
    if (!methods.includes(req.method)) {
      return res.status(405).json({ message: "Method not allowed" });
    }

    try {
      await ensureSeedAccounts(process.env);
      const result = await handler(req.body || {}, process.env, req);
      return res.status(200).json(result);
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 500;
      const payload = {
        message: error.message || "Internal server error",
        error: error.message || "Internal server error",
        ...(error instanceof ApiError ? error.details : {}),
      };

      if (!(error instanceof ApiError)) {
        console.error(error);
      }

      return res.status(status).json(payload);
    }
  };
}
