"use client";

import { ModalsProvider } from "@/app/contexts/ModalsProvider";
import { PlannersProvider } from "@/app/contexts/PlannersProvider";
import { usePlanners } from "@/app/hooks/reactQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import ShareModal from "../modals/shareModal/ShareModal";
import PlannerList from "./PlannerList";
import ExportModal from "./modals/exportModal/ExportModal";
import PlannerTabs from "./plannerTabs/PlannerTabs";

export default function Planners() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { data: planners } = usePlanners(userId);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (planners && planners.length == 0) {
      router.push("/curriculum-select");
    }
  }, [planners, router]);

  useEffect(() => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ["planners", userId] });
    }
  }, [queryClient, userId]);

  return (
    <PlannersProvider>
      <ModalsProvider>
        <div className="flex flex-col py-4 mb-auto flex-1 min-h-0 gap-4">
          <div className="flex justify-left px-7">
            <PlannerTabs />
          </div>
          <div className="flex px-5 flex-1 justify-center items-stretch min-h-0">
            <PlannerList />
          </div>
        </div>
        <ExportModal />
        <ShareModal />
      </ModalsProvider>
    </PlannersProvider>
  );
}
