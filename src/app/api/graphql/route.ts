import { createYoga } from "graphql-yoga";
import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import { NextRequest, NextResponse } from "next/server";
import { MemberResolver } from "../../../graphql/member/resolver";

const schema = buildSchemaSync({
  resolvers: [MemberResolver],
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

export { handleRequest as POST };
