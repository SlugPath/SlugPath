import { CourseService } from "@/graphql/course/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const departmentCode =
    request.nextUrl.searchParams.get("departmentCode") ?? "";
  const number = request.nextUrl.searchParams.get("number") ?? "";
  const ge = request.nextUrl.searchParams.get("ge") ?? "";

  const res = await new CourseService().coursesBy({
    departmentCode,
    number,
    ge,
  });
  return NextResponse.json(res);
}
