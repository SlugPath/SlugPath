import { queryDetailsSchema } from "@/app/types/Course";
import { CourseService } from "@/graphql/course/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const queryParams = queryDetailsSchema.parse(await request.json());
  const res = new CourseService().coursesBy(queryParams);
  return NextResponse.json(res);
}
