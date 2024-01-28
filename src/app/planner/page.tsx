"use client";

import apolloClient from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import App from "@components/App";
import useConfirmPageLeave from "@hooks/useConfirmPageLeave";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();

  useConfirmPageLeave(status === "unauthenticated");
  return (
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
}
