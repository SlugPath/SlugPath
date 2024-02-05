import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useContext } from "react";

import {
  getUserRole,
  userHasMajorEditingPermission,
} from "../actions/permissions";
import { DefaultPlannerContext } from "../contexts/DefaultPlannerProvider";

export default function useUserPermissions() {
  const { data: session } = useSession();
  const { userMajorData } = useContext(DefaultPlannerContext);

  const { data: hasPermissionToEdit } = useQuery({
    queryKey: ["userHasMajorEditingPermission"],
    queryFn: () =>
      userHasMajorEditingPermission(session!.user.id, userMajorData!),
    enabled: !!session && !!userMajorData,
  });

  const { data: userRole } = useQuery({
    queryKey: ["getUserRole"],
    queryFn: () => getUserRole(session!.user.id),
    enabled: !!session,
  });

  return {
    hasPermissionToEdit: hasPermissionToEdit ?? false,
    isAdmin: userRole === "ADMIN",
  };
}
