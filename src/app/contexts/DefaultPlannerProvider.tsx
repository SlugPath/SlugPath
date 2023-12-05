import { createContext } from "react";
import { DefaultPlannerContextProps } from "../types/Context";
import { useSession } from "next-auth/react";
import { useDefaultPlanner } from "../hooks/useDefaultPlanner";

export const DefaultPlannerContext = createContext(
  {} as DefaultPlannerContextProps,
);

export function DefaultPlannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { defaultPlanner } = useDefaultPlanner(session?.user.id);

  return (
    <DefaultPlannerContext.Provider
      value={{
        defaultPlanner,
      }}
    >
      {children}
    </DefaultPlannerContext.Provider>
  );
}
