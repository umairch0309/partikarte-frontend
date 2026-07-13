export class ApiError extends Error {
  constructor(message, status = 400, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}
