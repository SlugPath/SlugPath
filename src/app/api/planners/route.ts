import { saveAllPlanners } from "@/app/actions/planner";
import { PlannerData } from "@/app/types/Planner";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema = z.object({
  planners: z.array(z.custom<PlannerData>()),
  userId: z.string(),
});

export async function POST(request: NextRequest) {
  const payload = payloadSchema.parse(await request.json());
  await saveAllPlanners(payload);
  return NextResponse.json({ success: true });
}
