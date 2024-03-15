import { getUserPlannersByEmail } from "@actions/planner";
import Planners from "@components/planners/Planners";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const queryClient = new QueryClient();

  const session = await getServerSession();

  if (!session) redirect("/");

  await queryClient.prefetchQuery({
    queryKey: ["planners"],
    queryFn: async () => {
      const userEmail = session.user.email ?? "";
      if (userEmail.length === 0) return [];
      return await getUserPlannersByEmail(userEmail);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Planners />
    </HydrationBoundary>
  );
}
