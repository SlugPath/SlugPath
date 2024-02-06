import { env } from "@/env/server.mjs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { exec } from "child_process";
import { createReadStream } from "fs";
import { NextRequest, NextResponse } from "next/server";

const backupFilePath = "/tmp/backup";

export async function GET(req: NextRequest) {
  if (req.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create unique backup name
  const currentDate = new Date();
  const formattedMonth = (currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0");
  const formattedDay = currentDate.getDate().toString().padStart(2, "0");
  const formattedDate = `${formattedMonth}${formattedDay}${currentDate.getFullYear()}`;
  const backupFileName = `${backupFilePath}${formattedDate}.sql`;
  // Create destination
  const s3Dest = `backup${formattedDate}.sql`;

  // Prepare the pg_dump command
  const url = env.POSTGRES_PRISMA_URL.replace(/\?.*$/, "");
  const pgDumpCommand = `pg_dump ${url} > ${backupFileName}`;

  // Execute the pg_dump command
  exec(pgDumpCommand, async (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return NextResponse.json(
        { error: "Error creating backup" },
        { status: 500 },
      );
    }

    // Upload backup to S3
    const s3 = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: s3Dest,
      Body: createReadStream(backupFileName),
    });

    try {
      await s3.send(command);
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "Error uploading backup to S3" },
        { status: 500 },
      );
    }
  });

  return NextResponse.json({ message: "Backup created and uploaded to S3" });
}
