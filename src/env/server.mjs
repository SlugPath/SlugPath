import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    LOGFLARE_API_KEY: z.string().min(1),
    LOGFLARE_SOURCE_TOKEN: z.string().min(1),
    PAUSE_TOKEN: z.string().min(1),
    WEBHOOK_SECRET: z.string().min(1),
    PROJECT_ID: z.string().min(1),
    TEAM_ID: z.string().min(1),
    SHA: z.string().min(1),
    POSTGRES_PRISMA_URL: z.string().url(),
  },
  runtimeEnv: {
    LOGFLARE_API_KEY: process.env.LOGFLARE_API_KEY,
    LOGFLARE_SOURCE_TOKEN: process.env.LOGFLARE_SOURCE_TOKEN,
    PAUSE_TOKEN: process.env.PAUSE_TOKEN,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    PROJECT_ID: process.env.PROJECT_ID,
    TEAM_ID: process.env.TEAM_ID,
    SHA: process.env.SHA,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
  },
});
