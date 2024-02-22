import { Major } from "@/app/types/Major";
import { Permissions } from "@customTypes/Permissions";

export interface PermissionsContextProps {
  loadingPermissions: boolean;
  isSaved: boolean;
  permissionsList: Permissions[];
  onSetPermissionsList: (permissions: Permissions[]) => void;
  onSavePermissions: () => void;
  isAdmin: boolean;
  majorsAllowedToEdit: Major[];
}
