import { useEffect, useState } from "react";
import { userHasMajorEditingPermission } from "@/app/actions/actions";
import { useSession } from "next-auth/react";
import useMajorSelection from "./useMajorSelection";

export default function useUserPermissions() {
  const { data: session } = useSession();
  const { userMajorData } = useMajorSelection(session?.user.id);
  const [hasPermissionToEdit, setHasPermissionToEdit] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await userHasMajorEditingPermission(
          session!.user.id,
          userMajorData,
        );
        setHasPermissionToEdit(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (session?.user.id !== undefined && userMajorData !== undefined) {
      fetchData();
    }
  }, [session, userMajorData]);

  return {
    hasPermissionToEdit,
  };
}
