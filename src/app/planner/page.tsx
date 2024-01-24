"use client";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { useSession } from "next-auth/react";
import useConfirmPageLeave from "../hooks/useConfirmPageLeave";
import App from "../components/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  const { status } = useSession();

  useConfirmPageLeave(status === "unauthenticated");
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ApolloProvider>
  );
}
