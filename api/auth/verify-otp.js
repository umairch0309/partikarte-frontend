import { createHandler } from "../_lib/createHandler.js";
import { verifyOtp } from "../_lib/authService.js";

export default createHandler((body) => verifyOtp(body, "business"));
