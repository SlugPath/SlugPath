import Planners from "@components/planners/Planners";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";

import { getUserPlanners } from "../../actions/planner";

export default async function Home() {
  const session = await getServerSession();
  const userId = session?.user.id ?? "";
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["planners"],
    queryFn: async () => {
      if (userId.length === 0) return [];
      return await getUserPlanners(userId);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Planners />
    </HydrationBoundary>
  );
}
