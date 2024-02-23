import { Major } from "@/app/types/Major";
import { Permissions } from "@/app/types/Permissions";

export function hasPermissionToEditMajor(
  major: Major,
  majorsAllowedToEdit: Major[],
) {
  return majorsAllowedToEdit.some(
    (m) => m.name == major.name && m.catalogYear == major.catalogYear,
  );
}

export function getMajorsAllowedToEdit(
  permissions: Permissions | undefined | null,
): Major[] {
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
