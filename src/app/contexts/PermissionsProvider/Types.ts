import { Major } from "@/app/types/Major";
import { Permission } from "@/app/types/Permission";

export interface PermissionsContextProps {
  loadingPermissions: boolean;
  isSaved: boolean;
  permissions: Permission[];
  onUpsertPermission: (permission: Permission) => void;
  onRemovePermission: (userEmail: string) => void;
  isAdmin: boolean;
  majorsAllowedToEdit: Major[];
}
