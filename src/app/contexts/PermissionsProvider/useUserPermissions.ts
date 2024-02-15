import {
  getUserRole,
  userHasMajorEditingPermission,
} from "@actions/permissions";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function useUserPermissions() {
  const { data: session } = useSession();

  const { data: hasPermissionToEdit, refetch: refetchHasPermissionToEdit } =
    useQuery({
      queryKey: ["userHasMajorEditingPermission"],
      queryFn: () => userHasMajorEditingPermission(session!.user.id),
      enabled: !!session,
    });

  const { data: userRole } = useQuery({
    queryKey: ["getUserRole"],
    queryFn: () => getUserRole(session!.user.id),
    enabled: !!session,
  });

  return {
    hasPermissionToEdit: hasPermissionToEdit ?? false,
    isAdmin: userRole === "ADMIN",
    refetchHasPermissionToEdit,
  };
}
