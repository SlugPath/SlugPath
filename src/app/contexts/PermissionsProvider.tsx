import { PermissionsContextProps } from "@customTypes/Context";
import { createContext } from "react";

import usePermissions from "../components/permissionsModal/usePermissions";

export const PermissionsContext = createContext({} as PermissionsContextProps);

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isPending: loadingPermissions,
    isSaved,
    permissionsList,
    onSetPermissionsList,
    onSavePermissions,
    isAdmin,
    hasPermissionToEdit,
  } = usePermissions();

  return (
    <PermissionsContext.Provider
      value={{
        loadingPermissions,
        isSaved,
        permissionsList,
        onSetPermissionsList,
        onSavePermissions,
        isAdmin,
        hasPermissionToEdit,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}