"use client";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";
import App from "./components/App";

export default function Home() {
  return (
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
}
