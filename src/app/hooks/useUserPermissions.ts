import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  getUserRole,
  userHasMajorEditingPermission,
} from "../actions/permissionsActions";
import useMajorSelection from "../components/majorSelection/useMajorSelection";

export default function useUserPermissions() {
  const { data: session } = useSession();
  const { userMajorData } = useMajorSelection(session?.user.id);

  const { data: hasPermissionToEdit } = useQuery({
    queryKey: ["userHasMajorEditingPermission"],
    queryFn: () =>
      userHasMajorEditingPermission(session!.user.id, userMajorData),
  });

  const { data: userRole } = useQuery({
    queryKey: ["getUserRole"],
    queryFn: () => getUserRole(session!.user.id),
  });

  return {
    hasPermissionToEdit: hasPermissionToEdit ?? false,
    isAdmin: userRole === "ADMIN",
  };
}
