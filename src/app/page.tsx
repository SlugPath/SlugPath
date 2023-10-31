"use client";
import CoursePlanner from "./components/CoursePlanner";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";

export default function Home() {
  return (
    <div className="bg-gray-100">
      <ApolloProvider client={apolloClient}>
        <CoursePlanner />
      </ApolloProvider>
    </div>
  );
}
