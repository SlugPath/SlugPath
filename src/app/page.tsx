import MajorSelectionPage from "@components/majorSelection/MajorSelectionPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getUserMajor } from "./actions/major";

export default async function Page() {
  const redirectToPlanner = () => redirect("/planner");

  const session = await getServerSession();
  const userMajor = await getUserMajor(session?.user.email ?? "");

  if (userMajor) {
    return redirectToPlanner();
  }

  return <MajorSelectionPage />;
}
