"use client";
import CoursePlanner from "./components/CoursePlanner";
import { ApolloProvider } from '@apollo/client'
import apolloClient from '../lib/apollo'
import * as React from 'react'

export default function Home() {
  return (
    <ApolloProvider client={apolloClient}>
      <CoursePlanner />
    </ApolloProvider>
  );
}
