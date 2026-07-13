import { createHandler } from "../_lib/createHandler.js";
import { registerBusinessUser } from "../_lib/authService.js";

export default createHandler((body, env) => registerBusinessUser(body, env));
