"use client";
import CoursePlanner from "./components/CoursePlanner";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";

export default function Home() {
  return (
    <ApolloProvider client={apolloClient}>
      <CoursePlanner />
    </ApolloProvider>
  );
}
