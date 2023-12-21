import { createContext, useState } from "react";
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
  const [defaultPlanner] = useLoadDefaultPlanner(session?.user.id);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);

  return (
    <DefaultPlannerContext.Provider
      value={{
        defaultPlanner,
        hasAutoFilled,
        setHasAutoFilled,
      }}
    >
      {children}
    </DefaultPlannerContext.Provider>
  );
}
