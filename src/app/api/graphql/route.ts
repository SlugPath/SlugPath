import { createYoga } from "graphql-yoga";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { NextRequest, NextResponse } from "next/server";
import { CourseResolver } from "@/graphql/course/resolver";
import { PlannerResolver } from "@/graphql/planner/resolver";
import { MajorResolver } from "@/graphql/major/resolver";
import prisma from "@/lib/prisma";

// TODO: restrict to specific resolver functions we need, and give public users read-only access
const schema = buildSchema({
  resolvers: [CourseResolver, PlannerResolver, MajorResolver],
  validate: true,
});

const context = {
  prisma: prisma,
};

const { handleRequest } = createYoga({
  logging: true,
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: {
    Request: NextRequest,
    Response: NextResponse,
  },
  context,
});

export { handleRequest as GET, handleRequest as POST };
