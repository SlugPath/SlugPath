import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();
  if (!session?.user.id) redirect("/planner");

  // TODO: Fix (will be fixed in account creation flow PR)
  return (
    <div>
      <h1>Please sign in </h1>
    </div>
  );
}
