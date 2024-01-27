import { env } from "@/env/server.mjs";
import { SHA } from "@/config";
import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

const { stream, send } = logflarePinoVercel({
  apiKey: env.LOGFLARE_API_KEY,
  sourceToken: env.LOGFLARE_SOURCE_TOKEN,
});

// create pino logger
const logger = pino(
  {
    browser: {
      transmit: {
        level: "info",
        send: send,
      },
    },
    level: "debug",
    base: {
      env: process.env,
      revision: SHA,
    },
  },
  stream,
);

export default logger;
