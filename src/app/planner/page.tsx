import { authOptions } from "@/lib/auth";
import Planners from "@components/planners/Planners";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";

import { getUserPlanners } from "../actions/planner";
import { PlannerData } from "../types/Planner";

export default async function Planner() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? "";
  const queryClient = new QueryClient();

  // Prefetch the user's planners
  await queryClient.prefetchQuery({
    queryKey: ["planners", userId],
    queryFn: async () => {
      if (userId.length === 0) return [];
      return await getUserPlanners(userId);
    },
  });

  // Get the user's planners from the prefetch above
  const planners = queryClient.getQueryData(["planners", userId]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Planners initialPlanners={planners as PlannerData[]} />
    </HydrationBoundary>
  );
}
