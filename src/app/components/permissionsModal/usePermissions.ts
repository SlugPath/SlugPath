import useUserPermissions from "@/app/hooks/useUserPermissions";
import { Permissions } from "@/app/types/Permissions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { getPermissions, savePermissions } from "../../actions/permissions";

export default function usePermissions() {
  const [permissionsList, setPermissionsList] = useState<Permissions[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const { data: session } = useSession();
  const { isAdmin, majorsAllowedToEdit, refetchGetUserPermissions } =
    useUserPermissions();
  const { isPending } = useQuery({
    queryKey: ["getPermissions"],
    queryFn: async () => {
      const permissions = await getPermissions();
      if (permissions) {
        setPermissionsList(permissions);
      }
      return permissions;
    },
  });
  const { isPending: mutationPending, mutate } = useMutation({
    mutationFn: () => savePermissions(session!.user.id, permissionsList),
    onSuccess: () => {
      setIsSaved(true);
      refetchGetUserPermissions();
    },
  });

  function handleSetPermissionsList(newPermissionsList: Permissions[]) {
    setPermissionsList(newPermissionsList);
    setIsSaved(false);
  }

  return {
    isSaved,
    isPending: isPending || mutationPending,
    permissionsList,
    onSetPermissionsList: handleSetPermissionsList,
    onSavePermissions: mutate,
    isAdmin,
    majorsAllowedToEdit,
  };
}
