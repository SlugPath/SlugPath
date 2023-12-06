"use client";

import apolloClient from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";

export const NextAuthProvider = ({ children }: any) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export const NextApolloProvider = ({ children }: any) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
