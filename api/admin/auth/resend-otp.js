import { createHandler } from "../../_lib/createHandler.js";
import { resendVerificationOtp } from "../../_lib/authService.js";

export default createHandler((body, env) => resendVerificationOtp(body, "admin", env));
