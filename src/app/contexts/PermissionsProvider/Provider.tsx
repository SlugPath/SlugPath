import { createContext } from "react";

import usePermissions from "../../hooks/usePermissions";
import { PermissionsContextProps } from "./Types";

export const PermissionsContext = createContext({} as PermissionsContextProps);

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isPending: loadingPermissions,
    isSaved,
    permissions,
    onUpsertPermission,
    onRemovePermission,
    isAdmin,
    majorsAllowedToEdit,
  } = usePermissions();

  return (
    <PermissionsContext.Provider
      value={{
        loadingPermissions,
        isSaved,
        permissions,
        onUpsertPermission,
        onRemovePermission,
        isAdmin,
        majorsAllowedToEdit,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}
