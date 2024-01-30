import { CourseService } from "@/graphql/course/service";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await new CourseService().getAllDepartments());
}
