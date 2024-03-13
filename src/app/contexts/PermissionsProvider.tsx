import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";
import { createContext } from "react";

import usePermissions from "../hooks/usePermissions";

export interface PermissionsContextProps {
  loadingPermissions: boolean;
  isSaved: boolean;
  permissions: Permission[];
  onUpsertPermission: (permission: Permission) => void;
  onRemovePermission: (userEmail: string) => void;
  isAdmin: boolean;
  majorsAllowedToEdit: Program[];
}

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
