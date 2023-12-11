"use client";
import Image from "next/image";
import MajorSelection from "./components/majorSelection/MajorSelection";
import LoginButton from "./components/LoginButton";
import { useSession } from "next-auth/react";
import { CssVarsProvider } from "@mui/joy";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import { useRouter } from "next/navigation";
import { DefaultPlannerProvider } from "./contexts/DefaultPlannerProvider";
import UnauthenticatedWarning from "./components/UnauthenticatedWarning";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  function redirectToPlanner() {
    router.push("/planner");
  }

  return (
    <CssVarsProvider defaultMode="system">
      <div className="bg-bg-light dark:bg-bg-dark h-screen">
        <div className="bg-primary-500 text-secondary-100 dark:text-secondary-200 h-auto flex flex-row md:grid md:grid-cols-5 px-5 py-4">
          <div className="col-span-1" />
          <div className="col-span-3 flex flex-row place-items-center gap-2 md:gap-6 text-center text-4xl place-self-center">
            <Image
              src="/images/slug-icon.png"
              width={45}
              height={45}
              alt="Slug Icon"
            />
            <div>Welcome to the UCSC Course Planner!</div>
          </div>
          <div className="col-span-1 self-center justify-self-end">
            <LoginButton />
          </div>
        </div>

        {status !== "authenticated" ? (
          <div className="space-y-2 grid place-items-center">
            <UnauthenticatedWarning />
          </div>
        ) : null}
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
