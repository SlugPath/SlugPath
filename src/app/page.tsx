"use client";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";
import PlannerContainer from "./components/PlannerContainer";

export default function Home() {
  return (
    <ApolloProvider client={apolloClient}>
      <PlannerContainer />
    </ApolloProvider>
  );
}
