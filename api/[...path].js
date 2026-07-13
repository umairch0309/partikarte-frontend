import { handleApiRequest } from "./_lib/router.js";
import { ApiError } from "./_lib/errors.js";

export default async function handler(req, res) {
  try {
    const pathSegments = req.query.path || [];
    const apiPath = `/api/${Array.isArray(pathSegments) ? pathSegments.join("/") : pathSegments}`;
    const result = await handleApiRequest({
      url: apiPath,
      method: req.method,
      body: req.body || {},
      headers: req.headers,
      env: process.env,
    });

    return res.status(200).json(result);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return res.status(status).json({
      message: error.message || "Internal server error",
      error: error.message || "Internal server error",
      ...(error instanceof ApiError ? error.details : {}),
    });
  }
}
