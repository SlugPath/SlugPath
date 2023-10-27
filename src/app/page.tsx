"use client";
import CoursePlanner from "./components/CoursePlanner";
import Search from "./components/Search";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";

export default function Home() {
  return (
    <div className="bg-gray-100">
      <ApolloProvider client={apolloClient}>
        <Search />
        <CoursePlanner />
      </ApolloProvider>
    </div>
  );
}
