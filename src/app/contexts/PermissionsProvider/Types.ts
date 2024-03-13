import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";

export interface PermissionsContextProps {
  loadingPermissions: boolean;
  isSaved: boolean;
  permissions: Permission[];
  onUpsertPermission: (permission: Permission) => void;
  onRemovePermission: (userEmail: string) => void;
  isAdmin: boolean;
  majorsAllowedToEdit: Program[];
}
