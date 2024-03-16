export const APP_URL =
  process.env.NODE_ENV === "production"
    ? "https://app.slugpath.com"
    : "http://localhost:3000";

export const SHA =
  process.env.VERCEL_GITHUB_COMMIT_SHA || "undefined git commit sha";
