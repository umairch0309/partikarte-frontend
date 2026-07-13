import { createHandler } from "../../_lib/createHandler.js";
import { resetPassword } from "../../_lib/authService.js";

export default createHandler((body) => resetPassword(body, "admin"));
