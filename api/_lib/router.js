import { sendContactEmail } from "./emailService.js";
import {
  forgotPassword,
  loginUser,
  registerBusinessUser,
  resendVerificationOtp,
  resetPassword,
  verifyOtp,
  ensureSeedAccounts,
} from "./authService.js";
import { handleDataRequest } from "./dataService.js";
import { ApiError } from "./errors.js";
import { getBearerToken, validateSession } from "./sessionService.js";
import {
  createRole,
  deleteRole,
  updateRole,
} from "./roleService.js";

const postRoutes = {
  "/api/contact": (body, env) => {
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

    return sendContactEmail(
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
    ).then(() => ({ message: "Your message has been sent successfully" }));
  },
  "/api/auth/forgot-password": (body, env) => forgotPassword(body, "business", env),
  "/api/auth/verify-otp": (body) => verifyOtp(body, "business"),
  "/api/auth/resend-otp": (body, env) => resendVerificationOtp(body, "business", env),
  "/api/auth/reset-password": (body) => resetPassword(body, "business"),
  "/api/auth/register": (body, env) => registerBusinessUser(body, env),
  "/api/auth/login": (body, env) => loginUser(body, "business", env),
  "/api/admin/auth/forgot-password": (body, env) => forgotPassword(body, "admin", env),
  "/api/admin/auth/verify-otp": (body) => verifyOtp(body, "admin"),
  "/api/admin/auth/resend-otp": (body, env) => resendVerificationOtp(body, "admin", env),
  "/api/admin/auth/reset-password": (body) => resetPassword(body, "admin"),
  "/api/admin/auth/login": (body, env) => loginUser(body, "admin", env),
};

const publicGetPrefixes = [
  "all-events-for-customer",
  "single-event-for-customer",
  "business/businesses-for-customer",
  "business/business-for-customer",
];

function isPublicPath(path) {
  return publicGetPrefixes.some((prefix) => path.startsWith(prefix));
}

function buildApiPath(url = "") {
  return url.split("?")[0];
}

function getRelativeApiPath(url = "") {
  const apiPath = buildApiPath(url);
  return apiPath.replace(/^\/api\//, "");
}

function handleAuthenticatedMutation(relativePath, method, body, token) {
  if (!token) {
    throw new ApiError("Invalid token", 401);
  }

  const session = validateSession(token);

  if (method === "POST" && relativePath === "roles/create-role") {
    return createRole(body, session);
  }

  if (method === "PUT" && relativePath.startsWith("roles/update-role/")) {
    const roleId = relativePath.replace("roles/update-role/", "");
    return updateRole(roleId, body, session);
  }

  if (method === "DELETE" && relativePath.startsWith("roles/delete-role/")) {
    const roleId = relativePath.replace("roles/delete-role/", "");
    return deleteRole(roleId, session);
  }

  return null;
}

export async function handleApiRequest({
  url,
  method,
  body = {},
  headers = {},
  env = process.env,
}) {
  await ensureSeedAccounts(env);

  const apiPath = buildApiPath(url);
  const normalizedMethod = method.toUpperCase();

  if (normalizedMethod === "POST" && postRoutes[apiPath]) {
    return postRoutes[apiPath](body, env);
  }

  const relativePath = getRelativeApiPath(apiPath);
  const token = getBearerToken(headers.authorization || headers.Authorization);

  const mutationResult = handleAuthenticatedMutation(
    relativePath,
    normalizedMethod,
    body,
    token
  );
  if (mutationResult) {
    return mutationResult;
  }

  const isAuthRoute =
    apiPath.includes("/auth/login") ||
    apiPath.includes("/auth/register") ||
    apiPath.includes("/auth/forgot-password") ||
    apiPath.includes("/auth/verify-otp") ||
    apiPath.includes("/auth/reset-password") ||
    apiPath.includes("/auth/resend-otp");

  if (normalizedMethod === "GET" && !isAuthRoute) {
    if (!token && !isPublicPath(getRelativeApiPath(apiPath))) {
      throw new ApiError("Invalid token", 401);
    }

    const session = token ? validateSession(token) : null;
    return handleDataRequest(getRelativeApiPath(apiPath), session);
  }

  if (
    ["PUT", "PATCH", "DELETE"].includes(normalizedMethod) &&
    !isAuthRoute
  ) {
    if (!token) {
      throw new ApiError("Invalid token", 401);
    }

    validateSession(token);
    return { message: "Updated successfully" };
  }

  throw new ApiError("Route not found", 404);
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export function createDevApiPlugin(env) {
  return {
    name: "dev-api-server",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        const method = req.method || "GET";
        let body = "";

        const handleRequest = async (payload = {}) => {
          try {
            const result = await handleApiRequest({
              url: buildApiPath(req.url),
              method,
              body: payload,
              headers: req.headers,
              env,
            });

            sendJson(res, 200, result);
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

            sendJson(res, status, payload);
          }
        };

        if (method === "GET" || method === "DELETE") {
          return handleRequest();
        }

        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", async () => {
          const payload = body ? JSON.parse(body) : {};
          await handleRequest(payload);
        });
      });
    },
  };
}
