import { createYoga } from "graphql-yoga";
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import { NextRequest, NextResponse } from "next/server";
import { CourseResolver } from "../../../graphql/course/resolver";

const schema = buildSchemaSync({
  resolvers: [CourseResolver],
  validate: true,
});

const { handleRequest } = createYoga({
  logging: true,
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: {
    Request: NextRequest,
    Response: NextResponse,
  },
});

export { handleRequest as GET, handleRequest as POST };
