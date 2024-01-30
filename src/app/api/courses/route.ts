import { CourseService } from "@/graphql/course/service";
import { queryDetailsSchema } from "@customTypes/Course";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const json = await request.json();
  const { departmentCode, number, ge } = queryDetailsSchema.parse(json);
  const courses = await new CourseService().coursesBy({
    departmentCode,
    number,
    ge,
  });
  return NextResponse.json(courses);
}
