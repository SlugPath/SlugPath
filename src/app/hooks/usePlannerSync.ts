import { usePlanners, useUpdatePlannersMutation } from "@/app/hooks/reactQuery";
import usePlannersStore from "@/store/planners";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Hook to sync the local planners with the server on interval and beforeunload
 * @param intervalLength The interval length in milliseconds to save the planners
 */
export default function usePlannerSync(intervalLength = 30000) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Server planners
  const { data: initialPlanners } = usePlanners(userId);
  const { mutate: updatePlanners } = useUpdatePlannersMutation();

  // Local planners
  const planners = usePlannersStore((state) => state.planners);
  const setPlanners = usePlannersStore((state) => state.setPlanners);

  // Set initial planners
  // TODO: Prompt user intervention on sync conflict
  useEffect(() => {
    if (initialPlanners && planners.length === 0) {
      setPlanners(initialPlanners);
    }
  }, [initialPlanners, planners.length, setPlanners]);

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
