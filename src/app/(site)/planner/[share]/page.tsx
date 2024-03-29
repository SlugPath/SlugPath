import { authOptions } from "@/lib/auth";
import { duplicatePlanner } from "@actions/planner";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { share: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  await duplicatePlanner(session.user.id, params.share);
  redirect("/planner");
}
