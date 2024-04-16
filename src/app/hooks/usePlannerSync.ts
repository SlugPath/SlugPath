import { useUpdatePlannersMutation } from "@/app/hooks/reactQuery";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import usePlannersStore from "./usePlanners";

/**
 * Hook to sync the local planners with the server on interval and beforeunload
 *
 * @param intervalLength The interval length in milliseconds to save the planners
 */
export default function usePlannerSync(intervalLength = 30000) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Server planners
  const { mutate: updatePlanners } = useUpdatePlannersMutation();

  // TODO: check for server / client planner differences and promt user to to
  // resolve sync conflict

  // Local planners
  const planners = usePlannersStore((state) => state.planners);

  // Manage window focus
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  useEffect(() => {
    const handleFocus = () => {
      setIsWindowFocused(true);
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  // Save planners every 30 seconds
  useEffect(() => {
    const saveChanges = () => {
      if (userId && isWindowFocused) {
        updatePlanners({ userId, planners });
        console.log("Saved planners on interval");
      } else {
        console.log("Not saving planners, window not focused");
      }
    };
    const interval = setInterval(saveChanges, intervalLength);

    return () => {
      clearInterval(interval);
    };
  }, [updatePlanners, userId, planners, isWindowFocused, intervalLength]);

  // Save planners on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("beforeunload, saving planners");
      if (userId) {
        navigator.sendBeacon("/api/planners", JSON.stringify(planners));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userId, planners]);
}
