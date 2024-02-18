import { Permissions } from "@customTypes/Permissions";

export interface PermissionsContextProps {
  loadingPermissions: boolean;
  isSaved: boolean;
  permissionsList: Permissions[];
  onSetPermissionsList: (permissions: Permissions[]) => void;
  onSavePermissions: () => void;
  isAdmin: boolean;
  hasPermissionToEdit: boolean;
}
