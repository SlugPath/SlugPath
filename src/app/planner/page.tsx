import { getAllPlanners } from "@actions/planner";
import Planners from "@components/planners/Planners";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";

export default async function Home() {
  const queryClient = new QueryClient();

  const session = await getServerSession();

  await queryClient.prefetchQuery({
    queryKey: ["planners"],
    queryFn: async () => {
      const userEmail = session?.user.email ?? "";
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
