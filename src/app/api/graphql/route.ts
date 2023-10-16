import { createYoga } from "graphql-yoga";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { NextRequest, NextResponse } from "next/server";
//import { CourseResolver } from "../../../graphql/course/resolver";
import { resolvers } from "@generated/type-graphql";
import { createContext } from "@/lib/context";

//const allResolvers: any = [...resolvers, new CourseResolver()];

const schema = buildSchema({
  resolvers: resolvers,
  validate: false,
});

const { handleRequest } = createYoga({
  logging: true,
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: {
    Request: NextRequest,
    Response: NextResponse,
  },
  context: createContext,
});

export { handleRequest as GET, handleRequest as POST };
