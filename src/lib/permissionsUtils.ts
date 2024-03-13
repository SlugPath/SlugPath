import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";

export function hasPermissionToEditMajor(
  major: Program,
  majorsAllowedToEdit: Program[],
) {
  return majorsAllowedToEdit.some((m) => m.name == major.name);
}

export function getMajorsAllowedToEdit(
  permission: Permission | undefined | null,
): Program[] {
  // filter out expires major editing permissions
  const majorEditingPermissions =
    permission?.majorEditingPermissions.filter((majorEditPerm) => {
      if (majorEditPerm.expirationDate > new Date()) {
        return majorEditPerm;
      }
    }) ?? [];

  const majors = majorEditingPermissions.map((permission) => {
    return permission.major;
  });

  return majors;
}
