import { createHandler } from "../../_lib/createHandler.js";
import { loginUser } from "../../_lib/authService.js";

export default createHandler((body, env) => loginUser(body, "admin", env));
