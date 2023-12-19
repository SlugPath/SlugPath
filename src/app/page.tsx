"use client";
import MajorSelection from "./components/majorSelection/MajorSelection";
import { useSession } from "next-auth/react";
import { WarningAmberRounded } from "@mui/icons-material";
import { CssVarsProvider, Typography } from "@mui/joy";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { useRouter } from "next/navigation";
import { DefaultPlannerProvider } from "./contexts/DefaultPlannerProvider";
import BetaWarning from "./components/beta/BetaWarning";
import Navbar from "./components/Navbar";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  return (
    <CssVarsProvider defaultMode="system">
      <div className="bg-bg-light dark:bg-bg-dark min-h-screen pb-1">
        <Navbar />
        {status !== "authenticated" ? (
          <div className="space-y-2 grid place-items-center">
            <Typography
              variant="soft"
              color="warning"
              component="p"
              startDecorator={<WarningAmberRounded color="warning" />}
              justifyContent="center"
              className="py-2 px-6 rounded-b-2xl"
            >
              We recommend logging in with your UCSC email for a better
              experience.
            </Typography>
          </div>
        ) : null}
        <BetaWarning />
        <div className="grid place-items-center my-3 justify-center h-auto w-[66vw] mx-auto overflow-auto">
          <ApolloProvider client={apolloClient}>
            <DefaultPlannerProvider>
              <MajorSelection
                saveButtonName="Next"
                handleSave={() => router.push("/planner")}
              />
            </DefaultPlannerProvider>
          </ApolloProvider>
        </div>
      </div>
    </CssVarsProvider>
  );
}
