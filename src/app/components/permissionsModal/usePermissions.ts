import useUserPermissions from "@/app/hooks/useUserPermissions";
import { Permissions } from "@/app/types/Permissions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { getPermissions, savePermissions } from "../../actions/permissions";

export default function usePermissions() {
  const [permissionsList, setPermissionsList] = useState<Permissions[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  const { data: session } = useSession();
  const { isAdmin, hasPermissionToEdit, refetchHasPermissionToEdit } =
    useUserPermissions();
  const { isPending, data } = useQuery({
    queryKey: ["getPermissions"],
    queryFn: () => getPermissions(),
  });
  const mutation = useMutation({
    mutationFn: () => savePermissions(session!.user.id, permissionsList),
  });

  useEffect(() => {
    if (data) {
      setPermissionsList(data);
      setIsSaved(true);
    }
  }, [data, isPending]);

  useEffect(() => {
    if (mutation.isSuccess) {
      setIsSaved(true);

      // refetch hasPermissionToEdit as permissions have just been updated
      refetchHasPermissionToEdit();
    }
  }, [mutation.isSuccess, refetchHasPermissionToEdit]);

  function handleSetPermissionsList(newPermissionsList: Permissions[]) {
    setPermissionsList(newPermissionsList);
    setIsSaved(false);
  }

  return {
    isSaved,
    isPending: isPending || mutation.isPending,
    permissionsList,
    onSetPermissionsList: handleSetPermissionsList,
    onSavePermissions: () => {
      mutation.mutate();
    },
    isAdmin,
    hasPermissionToEdit,
  };
}
