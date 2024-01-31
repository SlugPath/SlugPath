export const APP_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const SHA =
  process.env.VERCEL_GITHUB_COMMIT_SHA || "undefined git commit sha";
