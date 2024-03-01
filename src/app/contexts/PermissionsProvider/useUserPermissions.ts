import { getUserPermissions, getUserRole } from "@/app/actions/permissions";
import { getMajorsAllowedToEdit } from "@/lib/permissionsUtils";
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

  return {
    majorsAllowedToEdit: getMajorsAllowedToEdit(permissions),
    isAdmin: userRole === "ADMIN",
    refetchGetUserPermissions: refetchGetUserPermissions,
  };
}
