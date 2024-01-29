import { env } from "@/env/server.mjs";
import crypto from "crypto";

export async function POST(request: Request) {
  if (env.WEBHOOK_SECRET === "undefined vercel webhook secret") {
    throw new Error("No web hook secret found");
  }

  const rawBody = await request.text();
  const rawBodyBuffer = Buffer.from(rawBody, "utf-8");
  const bodySignature = sha1(rawBodyBuffer, env.WEBHOOK_SECRET);

  if (bodySignature !== request.headers.get("x-vercel-signature")) {
    return Response.json({
      code: "invalid_signature",
      error: "signature didn't match",
    });
  }
  await fetch(
    `https://api.vercel.com/v1/projects/${env.PROJECT_ID}/pause?teamId=${env.TEAM_ID}`,
    {
      headers: {
        Authorization: `Bearer ${env.PAUSE_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );
  return new Response("Project successfully paused");
}

function sha1(data: Buffer, secret: string): string {
  return crypto.createHmac("sha1", secret).update(data).digest("hex");
}
