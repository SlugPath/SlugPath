import { saveAllPlanners } from "@/app/actions/planner";
import { PlannerData } from "@/app/types/Planner";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema = z.array(z.custom<PlannerData>());

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false });
  }
  const planners = payloadSchema.parse(await request.json());
  await saveAllPlanners({
    planners,
    userId: session.user.id,
  });
  return NextResponse.json({ success: true });
}
