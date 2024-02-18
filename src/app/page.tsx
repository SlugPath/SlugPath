import { getUserMajorByEmail } from "@actions/major";
import MajorSelectionPage from "@components/majorSelection/MajorSelectionPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const redirectToPlanner = () => redirect("/planner");

  const session = await getServerSession();
  const userMajor = await getUserMajorByEmail(session?.user.email ?? "");

  if (userMajor) {
    return redirectToPlanner();
  }

  return <MajorSelectionPage />;
}
