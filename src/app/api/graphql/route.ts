import { CourseResolver } from "@/graphql/course/resolver";
import { MajorResolver } from "@/graphql/major/resolver";
import { PlannerResolver } from "@/graphql/planner/resolver";
import prisma from "@/lib/prisma";
import { createYoga } from "graphql-yoga";
import { NextRequest, NextResponse } from "next/server";
import "reflect-metadata";
import { buildSchema } from "type-graphql";

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
