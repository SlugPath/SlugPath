import { Permission } from "@/app/types/Permission";
import {
  getPermissions,
  removePermission,
  upsertPermission,
} from "@actions/permissions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";

import useUserPermissions from "./useUserPermissions";

export default function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const { data: session } = useSession();
  const { isAdmin, hasPermissionToEdit, refetchHasPermissionToEdit } =
    useUserPermissions();
  const { isPending: getPermissionsPending } = useQuery({
    queryKey: ["getPermissions"],
    queryFn: async () => {
      const perms = await getPermissions();
      if (perms) {
        handleSetPermissions(perms);
      }
      return permissions;
    },
  });

  const {
    isPending: upsertPermissionPending,
    mutate: upsertPermissionMutation,
  } = useMutation({
    mutationFn: async (permission: Permission) => {
      const perm = await upsertPermission({
        userId: session!.user.id,
        permission,
      });
      replacePermissionInState(perm);
      return perm;
    },
    onSuccess: () => {
      setIsSaved(true);
      refetchHasPermissionToEdit();
    },
  });

  const {
    isPending: removePermissionPending,
    mutate: removePermissionMutation,
  } = useMutation({
    mutationFn: async (userEmail: string) => {
      const result = await removePermission({
        userId: session!.user.id,
        userEmail,
      });
      if (result.userEmail === userEmail) {
        removePermissionFromState(userEmail);
      }
      return result;
    },
    onSuccess: () => {
      setIsSaved(true);
      refetchHasPermissionToEdit();
    },
  });

  function replacePermissionInState(permission: Permission) {
    const userPermExists = permissions.find(
      (p) => p.userEmail === permission.userEmail,
    );
    if (userPermExists) {
      const newPerms = permissions.map((p) => {
        if (p.userEmail === permission.userEmail) {
          return permission;
        }
        return p;
      });
      handleSetPermissions(newPerms);
    } else {
      handleSetPermissions([...permissions, permission]);
    }
  }

  function removePermissionFromState(userEmail: string) {
    const newPerms = permissions.filter((p) => p.userEmail !== userEmail);
    handleSetPermissions(newPerms);
  }

  function sortPermissions(permissions: Permission[]): Permission[] {
    function sortMajorEditingPermissions(permission: Permission) {
      return permission.majorEditingPermissions.sort((a, b) =>
        a.major.name.localeCompare(b.major.name),
      );
    }

    const sortedPerms = permissions.sort((a, b) =>
      a.userEmail.localeCompare(b.userEmail),
    );
    return sortedPerms.map((p) => {
      return {
        ...p,
        majorEditingPermissions: sortMajorEditingPermissions(p),
      };
    });
  }

  // use this function when setting permissions, to ensure they are sorted
  function handleSetPermissions(permissions: Permission[]) {
    setPermissions(sortPermissions(permissions));
  }

  return {
    isSaved,
    isPending:
      getPermissionsPending ||
      upsertPermissionPending ||
      removePermissionPending,
    permissions,
    onUpsertPermission: upsertPermissionMutation,
    onRemovePermission: removePermissionMutation,
    isAdmin,
    hasPermissionToEdit,
  };
}
