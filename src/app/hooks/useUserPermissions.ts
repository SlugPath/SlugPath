import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { getUserPermissions, getUserRole } from "../actions/permissions";
import { Major } from "../types/Major";

export default function useUserPermissions() {
  const { data: session } = useSession();

  const { data: permissions, refetch: refetchGetUserPermissions } = useQuery({
    queryKey: ["userHasMajorEditingPermission"],
    queryFn: () => getUserPermissions(session!.user.id),
    enabled: !!session,
  });

  const { data: userRole } = useQuery({
    queryKey: ["getUserRole"],
    queryFn: () => getUserRole(session!.user.id),
    enabled: !!session,
  });

  function getMajorsAllowedToEdit(): Major[] {
    // filter out expires major editing permissions
    const majorEditingPermissions =
      permissions?.majorEditingPermissions.filter((majorEditPerm) => {
        if (majorEditPerm.expirationDate > new Date()) {
          return majorEditPerm;
        }
      }) ?? [];

    const majors = majorEditingPermissions.map((permission) => {
      return permission.major;
    });

    return majors;
  }

  return {
    majorsAllowedToEdit: getMajorsAllowedToEdit(),
    isAdmin: userRole === "ADMIN",
    refetchGetUserPermissions: refetchGetUserPermissions,
  };
}
