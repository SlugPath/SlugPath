import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import MajorSelectionPage from "./MajorSelectionPage";
import { getUserMajorsByEmail } from "./actions/major";

export default async function Page() {
  const redirectToPlanner = () => redirect("/planner");

  const session = await getServerSession();
  const userMajors = await getUserMajorsByEmail(session?.user.email ?? "");

  if (userMajors && userMajors.length > 0) {
    return redirectToPlanner();
  }

  return <MajorSelectionPage />;
}
