import { Major } from "@/app/types/Major";
import { Permission } from "@/app/types/Permission";

export function hasPermissionToEditMajor(
  major: Major,
  majorsAllowedToEdit: Major[],
) {
  return majorsAllowedToEdit.some((m) => m.name == major.name);
}

export function getMajorsAllowedToEdit(
  permission: Permission | undefined | null,
): Major[] {
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
