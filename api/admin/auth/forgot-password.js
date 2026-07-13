import { createHandler } from "../../_lib/createHandler.js";
import { forgotPassword } from "../../_lib/authService.js";

export default createHandler((body, env) => forgotPassword(body, "admin", env));
