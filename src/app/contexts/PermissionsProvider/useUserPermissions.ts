import { getUserPermissions, getUserRole } from "@/app/actions/permissions";
import { Major } from "@/app/types/Major";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function useUserPermissions() {
  const { data: session } = useSession();

  const { data: permissions, refetch: refetchGetUserPermissions } = useQuery({
    queryKey: ["userHasMajorEditingPermission"],
    queryFn: async () => await getUserPermissions(session!.user.id),
    enabled: !!session,
  });

  const { data: userRole } = useQuery({
    queryKey: ["getUserRole"],
    queryFn: async () => await getUserRole(session!.user.id),
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
