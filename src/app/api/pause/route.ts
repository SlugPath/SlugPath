import { PROJECT_ID, TEAM_ID, PAUSE_TOKEN, WEBHOOK_SECRET } from "@/config";
import crypto from "crypto";

export async function POST(request: Request) {
  if (WEBHOOK_SECRET === "undefined vercel webhook secret") {
    throw new Error("No web hook secret found");
  }

  const rawBody = await request.text();
  const rawBodyBuffer = Buffer.from(rawBody, "utf-8");
  const bodySignature = sha1(rawBodyBuffer, WEBHOOK_SECRET);

  if (bodySignature !== request.headers.get("x-vercel-signature")) {
    return Response.json({
      code: "invalid_signature",
      error: "signature didn't match",
    });
  }
  await fetch(
    `https://api.vercel.com/v1/projects/${PROJECT_ID}/pause?teamId=${TEAM_ID}`,
    {
      headers: {
        Authorization: `Bearer ${PAUSE_TOKEN}`,
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
