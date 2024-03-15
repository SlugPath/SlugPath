import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";
import {
  extractUnexpiredPrograms,
  sortPermissions,
} from "@/lib/permissionsUtils";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { createContext } from "react";

import {
  useDeleteUserPermissionMutation,
  usePermissions,
  useUpdateUserPermissionMutation,
  useUserPermissions,
  useUserRole,
} from "../hooks/reactQuery";

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
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Fetch permissions
  const { data: permissions, isPending: getPermissionsPending } =
    usePermissions(sortPermissions);

  // Fetch programsAllowedToEdit
  const { data: userPermissions, isPending: getUserPermissionsPending } =
    useUserPermissions(userId);

  const programsAllowedToEdit = useMemo(
    () => extractUnexpiredPrograms(userPermissions),
    [userPermissions],
  );

  // Fetch user role
  const { data: userRole } = useUserRole(userId);
  const isAdmin = userRole === "ADMIN";

  // Set permissions
  const {
    isPending: upsertPermissionPending,
    mutate: upsertPermissionMutation,
  } = useUpdateUserPermissionMutation();

  const {
    isPending: removePermissionPending,
    mutate: removePermissionMutation,
  } = useDeleteUserPermissionMutation();

  const isSaved = !(removePermissionPending || upsertPermissionPending);
  const isPending =
    getPermissionsPending ||
    getUserPermissionsPending ||
    upsertPermissionPending ||
    removePermissionPending;

  return (
    <PermissionsContext.Provider
      value={{
        loadingPermissions: isPending,
        isSaved,
        permissions: permissions ?? [],
        onUpsertPermission: (permission) =>
          upsertPermissionMutation({ userId: userId!, permission }),
        onRemovePermission: (userEmail: string) =>
          removePermissionMutation({ userId: userId!, userEmail }),
        isAdmin,
        majorsAllowedToEdit: programsAllowedToEdit,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}
