import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import MajorSelectionPage from "./MajorSelectionPage";

export default async function Page() {
  const session = await getServerSession();
  if (!session?.user.id) redirect("/planner");

  return <MajorSelectionPage />;
}
