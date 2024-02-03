"use client";

import apolloClient from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import App from "@components/App";
import useConfirmPageLeave from "@hooks/useConfirmPageLeave";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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
