"use client";

import apolloClient from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { CssVarsProvider } from "@mui/joy";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { DefaultPlannerProvider } from "./DefaultPlannerProvider";
import NextAuthProvider from "./NextAuthProvider";
import { PlannersProvider } from "./PlannersProvider";

export default function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <NextAuthProvider>
      <ApolloProvider client={apolloClient}>
        <CssVarsProvider defaultMode="system">
          <QueryClientProvider client={queryClient}>
            <DefaultPlannerProvider>
              <PlannersProvider>{children}</PlannersProvider>
            </DefaultPlannerProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </CssVarsProvider>
      </ApolloProvider>
    </NextAuthProvider>
  );
}
