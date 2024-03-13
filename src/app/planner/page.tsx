import Planners from "@components/planners/Planners";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { getAllPlanners } from "../actions/planner";

export default async function Home() {
  const session = await getServerSession();
  const queryClient = new QueryClient();
  if (!session) redirect("/");

  await queryClient.prefetchQuery({
    queryKey: ["planners"],
    queryFn: async () => {
      const userEmail = session.user.email ?? "";
      if (userEmail.length === 0) return [];
      return await getAllPlanners(userEmail);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Planners />
    </HydrationBoundary>
  );
}
