import { CourseService } from "@/graphql/course/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const departmentCode =
    request.nextUrl.searchParams.get("departmentCode") ?? "";
  const number = request.nextUrl.searchParams.get("number") ?? "";
  const res = await new CourseService().courseBy({
    departmentCode,
    number,
  });
  return NextResponse.json(res);
}
