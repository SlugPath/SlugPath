import { useEffect, useState } from "react";
import { Permissions } from "@/app/types/Permissions";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPermissions,
  savePermissions,
} from "../../actions/permissionsActions";
import { useSession } from "next-auth/react";

export default function usePermissions() {
  const [permissionsList, setPermissionsList] = useState<Permissions[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const { data: session } = useSession();
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
    }
  }, [mutation.isSuccess]);

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
  };
}
