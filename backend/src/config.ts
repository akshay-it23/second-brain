// Prefer environment variable for secrets in production
export const JWT_PASSWORD = process.env.JWT_PASSWORD || "secret";
