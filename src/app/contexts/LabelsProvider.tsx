import { createContext } from "react";
import { LabelsContextProps } from "../types/Context";
import { useLabels } from "../hooks/useLabels";
import { useSession } from "next-auth/react";

export const LabelsContext = createContext({} as LabelsContextProps);

export function LabelsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { labels, updateLabels } = useLabels(session?.user.id);

  return (
    <LabelsContext.Provider
      value={{
        labels,
        updateLabels,
      }}
    >
      {children}
    </LabelsContext.Provider>
  );
}
