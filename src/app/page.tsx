"use client";
import MajorSelection from "./components/majorSelection/MajorSelection";
import { useSession } from "next-auth/react";
import { CssVarsProvider } from "@mui/joy";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { useRouter } from "next/navigation";
import { DefaultPlannerProvider } from "./contexts/DefaultPlannerProvider";
import BetaWarning from "./components/beta/BetaWarning";
import Navbar from "./components/Navbar";
import UnauthenticatedWarning from "./components/UnauthenticatedWarning";

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
                handleSave={redirectToPlanner}
                handleUserMajorAlreadyExists={redirectToPlanner}
                handleSkip={redirectToPlanner}
              />
            </DefaultPlannerProvider>
          </ApolloProvider>
        </div>
      </div>
    </CssVarsProvider>
  );
}
