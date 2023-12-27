import { createContext, useEffect, useState } from "react";
import { DefaultPlannerContextProps } from "../types/Context";
import { useSession } from "next-auth/react";
import { useLoadDefaultPlanner } from "../hooks/useLoad";

export const DefaultPlannerContext = createContext(
  {} as DefaultPlannerContextProps,
);

export function DefaultPlannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [loadedDefaultPlanner] = useLoadDefaultPlanner(session?.user.id);

  // setDefaultPlanner is to instantly set the default planner in the context for MajorSelectionModal
  const [defaultPlanner, setDefaultPlanner] = useState(loadedDefaultPlanner); // [defaultPlanner, setDefaultPlanner
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  useEffect(() => {
    setDefaultPlanner(loadedDefaultPlanner);
  }, [loadedDefaultPlanner]);

  return (
    <DefaultPlannerContext.Provider
      value={{
        defaultPlanner,
        hasAutoFilled,
        setHasAutoFilled,
        setDefaultPlanner,
      }}
    >
      {children}
    </DefaultPlannerContext.Provider>
  );
}
