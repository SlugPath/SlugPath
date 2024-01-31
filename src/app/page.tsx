"use client";

import apolloClient from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import BetaWarning from "@components/beta/BetaWarning";
import MajorSelection from "@components/majorSelection/MajorSelection";
import UnauthenticatedWarning from "@components/modals/UnauthenticatedWarning";
import Navbar from "@components/navbar/Navbar";
import { DefaultPlannerProvider } from "@contexts/DefaultPlannerProvider";
import { CssVarsProvider } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  function redirectToPlanner() {
    router.push("/planner");
  }

  return (
    <CssVarsProvider defaultMode="system">
      <div className="bg-bg-light dark:bg-bg-dark min-h-screen pb-1">
        <Navbar />
        {status !== "authenticated" ? (
          <div className="space-y-2 grid place-items-center">
            <UnauthenticatedWarning />
          </div>
        ) : null}
        <BetaWarning />
        <div className="grid place-items-center my-3 justify-center h-auto w-[66vw] mx-auto overflow-auto">
          <ApolloProvider client={apolloClient}>
            <DefaultPlannerProvider>
              <MajorSelection
                saveButtonName="Next"
                onSaved={redirectToPlanner}
                onUserMajorAlreadyExists={redirectToPlanner}
                onSkip={redirectToPlanner}
              />
            </DefaultPlannerProvider>
          </ApolloProvider>
        </div>
      </div>
    </CssVarsProvider>
  );
}
