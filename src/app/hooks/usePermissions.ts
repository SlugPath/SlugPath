import { useEffect, useState } from "react";
import { getPermissions, savePermissions } from "@/app/actions/actions";
import { Permissions } from "@/app/types/Permissions";

export default function usePermissions() {
  const [permissionsList, setPermissionsList] = useState<Permissions[]>([]);

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

  async function handleSaveUsers() {
    try {
      await savePermissions(permissionsList);
    } catch (error) {
      console.error("Error saving users permissions:", error);
    }
  }

  return {
    permissionsList,
    setPermissionsList,
    onSavePermissions: handleSaveUsers,
  };
}
