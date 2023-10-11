import { ENV, LOGFLARE_API_KEY, LOGFLARE_SOURCE_TOKEN, SHA } from "@/config";
import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

const { stream, send } = logflarePinoVercel({
  apiKey: LOGFLARE_API_KEY,
  sourceToken: LOGFLARE_SOURCE_TOKEN,
});

// create pino logger
const logger = pino({
  browser: {
    transmit: {
      level: "info",
      send: send,
    },
  },
  level: "debug",
  base: {
    env: ENV,
    revision: SHA,
  },
}, stream);

export default logger;
