import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import StepByStepLayout from "./StepByStepLayout";

// NOTE: Component logic requires client, but routing logic is server-side
export default async function StepByStepLayoutRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session && session.user.isRecordCreated) {
    redirect("/planner");
  }

  return <StepByStepLayout>{children}</StepByStepLayout>;
}
