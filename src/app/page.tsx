"use client";
import CoursePlanner from "./components/CoursePlanner";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";
import { useSession } from "next-auth/react";
import useConfirmPageLeave from "./hooks/useConfirmPageLeave";

export default function Home() {
  const { status } = useSession();

  useConfirmPageLeave(status === "unauthenticated");
  return (
    <div className="bg-gray-100">
      <ApolloProvider client={apolloClient}>
        <CoursePlanner />
      </ApolloProvider>
    </div>
  );
}
