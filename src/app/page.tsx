"use client";
import { Typography } from "@mui/joy";
import MajorSelection from "./components/MajorSelection";
import LoginButton from "./components/LoginButton";
import { useSession } from "next-auth/react";
import { WarningAmberRounded } from "@mui/icons-material";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  return (
    <div className="bg-slate-200 h-full min-h-screen">
      <div className="flex flex-row justify-between items-center px-5 py-2">
        <div className="flex" />
        <Typography level="h1" className="flex text-center">
          Welcome to the UCSC Course Planner!
        </Typography>
        <div className="flex justify-end">
          <LoginButton />
        </div>
      </div>

      {status !== "authenticated" ? (
        <div className="flex flex-row bg-orange-100 justify-center items-center gap-2 p-2">
          <WarningAmberRounded color="warning" />
          <div>
            We recommend logging in with your UCSC email for a better
            experience.
          </div>
        </div>
      ) : null}
      <div className="flex flex-col items-center justify-center h-[80vh] w-[33vw] mx-auto">
        <ApolloProvider client={apolloClient}>
          <MajorSelection
            saveButtonName="Next"
            handleSave={() => router.push("/planner")}
          />
        </ApolloProvider>
      </div>
    </div>
  );
}
