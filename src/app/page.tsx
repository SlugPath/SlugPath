import MajorSelectionPage from "@components/majorSelection/MajorSelectionPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getUserMajorsByEmail } from "./actions/major";

export default async function Page() {
  const redirectToPlanner = () => redirect("/planner");

  const session = await getServerSession();
  const userMajors = await getUserMajorsByEmail(session?.user.email ?? "");

  if (userMajors) {
    return redirectToPlanner();
  }

  return <MajorSelectionPage />;
}
