import { useEffect, useState } from "react";
import { getPermissions, savePermissions } from "@/app/actions/actions";
import { Permissions } from "@/app/types/Permissions";

export default function usePermissions() {
  const [permissionsList, setPermissionsList] = useState<Permissions[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPermissions();
        setPermissionsList(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  function handleSetPermissionsList(newPermissionsList: Permissions[]) {
    setPermissionsList(newPermissionsList);
    setIsSaved(false);
  }

  async function handleSaveUsers() {
    setLoading(true);
    try {
      await savePermissions(permissionsList);
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving users permissions:", error);
    }
    setLoading(false);
  }

  return {
    isSaved,
    loading,
    permissionsList,
    onSetPermissionsList: handleSetPermissionsList,
    onSavePermissions: handleSaveUsers,
  };
}
