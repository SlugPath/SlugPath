import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXTAUTH_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});
