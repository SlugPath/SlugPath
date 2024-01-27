import { useEffect, useState } from "react";
import { getPermissions, savePermissions } from "@/app/actions/actions";
import { Permissions } from "@/app/types/Permissions";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function usePermissions() {
  const [permissionsList, setPermissionsList] = useState<Permissions[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const { isPending, data } = useQuery({
    queryKey: ["getPermissions"],
    queryFn: () => getPermissions(),
  });
  const mutation = useMutation({
    mutationFn: () => savePermissions(permissionsList),
  });

  useEffect(() => {
    if (data) {
      setPermissionsList(data);
      setIsSaved(true);
      console.log("data");
      console.log(data);
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
