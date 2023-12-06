export const LOGFLARE_API_KEY =
  process.env.LOGFLARE_API_KEY || "undefined logflare API key";
export const LOGFLARE_SOURCE_TOKEN =
  process.env.LOGFLARE_SOURCE_TOKEN || "undefined logflare source token";
export const ENV = process.env.VERCEL_ENV || process.env.NODE_ENV;
export const SHA =
  process.env.VERCEL_GIT_COMMIT_SHA || "undefined git commit SHA";
export const PAUSE_TOKEN =
  process.env.PAUSE_TOKEN || "undefined vercel pause token";
export const WEBHOOK_SECRET =
  process.env.WEBHOOK_SECRET || "undefined vercel webhook secret";
export const PROJECT_ID =
  process.env.PROJECT_ID || "undefined vercel project id";
export const TEAM_ID = process.env.TEAM_ID || "undefined vercel team id";
export const APP_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";
