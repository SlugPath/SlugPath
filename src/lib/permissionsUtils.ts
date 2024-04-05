import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";

export const DEFAULT_DAYS_TO_PERMISSION_EXPIRATION = 14;

/**
 * Check if the user has permission to edit a program
 *
 * QUESTION: Too declarative? In reality the function checks if param exists in
 * array.  Maybe should be called `isProgramInPrograms`
 * @param program Program to check if user has permission to edit
 * @param programsAllowedToEdit List of programs that the user has permission to edit
 * @returns
 */
export function hasPermissionToEditProgram(
  program: Program,
  programsAllowedToEdit: Program[],
) {
  return programsAllowedToEdit.some((m) => m.name == program.name);
}

/**
 * Sort majorEditingPermissions by program name
 * @param permission List of program editing permissions
 * @returns List of program editing permissions sorted by program name
 */
export function sortProgramEditingPermissions(permission: Permission) {
  return permission.majorEditingPermissions.sort((a, b) =>
    a.major.name.localeCompare(b.major.name),
  );
}

/**
 * Sort permissions by user email (first) and major name (second)
 * @param permissions List of permissions for various users
 * @returns List of permissions sorted by user email and major name
 */
export function sortPermissions(permissions: Permission[]) {
  const sortedEmails = permissions.sort((a, b) =>
    a.userEmail.localeCompare(b.userEmail),
  );

  // Second sort by major name
  return sortedEmails.map((p) => {
    return {
      ...p,
      majorEditingPermissions: sortProgramEditingPermissions(p),
    };
  });
}

/**
 * Extract the list of programs that the user has permission to edit
 * @param permission UserId and list of program editing permissions
 * @returns List of programs that the user has permission to edit
 */
export function extractUnexpiredPrograms(
  permission: Permission | undefined | null,
): Program[] {
  // filter out expired major editing permissions
  const programEditingPermissions =
    permission?.majorEditingPermissions.filter((programEditPerm) => {
      if (programEditPerm.expirationDate > new Date()) {
        return programEditPerm;
      }
    }) ?? [];

  const programs = programEditingPermissions.map((permission) => {
    return permission.major;
  });

  return programs;
}

/**
 * Check if the email is contained in the permissions list
 * @param email an email to check if it is already added
 * @param permissions a list of permissions to check if the email is in
 * @returns true if the email is already in the permissions list, false otherwise
 */
export function isUserAlreadyAdded(
  email: string,
  permissions: Permission[] | undefined,
) {
  if (!permissions) return false;
  return permissions.some((p) => p.userEmail === email);
}

/**
 * Check if the program is contained in the permission
 * @param program a program to check if it is already added
 * @param permission a permission to check if the program is in
 * @returns true if the program is already in the permission, false otherwise
 */
export function isProgramAlreadyAdded(
  program: Program,
  permission: Permission,
) {
  return permission.majorEditingPermissions.some((m) => {
    const otherMajor = m.major;
    return (
      otherMajor.name === program.name &&
      otherMajor.catalogYear === program.catalogYear
    );
  });
}

// Permissions Mutations

/**
 * Immutable function to add a new program to the permissions
 * @param program a program to add to the permissions
 * @param permission permission to add the program to
 * @returns a new permission object with the program added
 */
export function addNewProgramToPermissions(
  program: Program,
  permission: Permission,
) {
  const _permission = { ...permission };
  const expirationDate = new Date();
  expirationDate.setDate(
    expirationDate.getDate() + DEFAULT_DAYS_TO_PERMISSION_EXPIRATION,
  );

  _permission.majorEditingPermissions.push({
    major: program,
    expirationDate,
  });
  return _permission;
}

/**
 * Immutable function to remove a program from the permissions
 * @param programName a program to remove from the permissions
 * @param permission permission to remove the program from
 * @returns a new permission object with the program removed
 */
export function removeProgramFromPermissions(
  programName: string,
  permission: Permission,
) {
  const _permission = { ...permission };
  _permission.majorEditingPermissions =
    _permission.majorEditingPermissions.filter((programEditPerm) => {
      const otherMajor = programEditPerm.major;
      return otherMajor.name !== programName;
    });
  return _permission;
}

/**
 * Immutable function to update the expiration date of a program in the
 * permissions
 * @param program a program to update the expiration date for
 * @param expirationDate new expiration date for the program
 * @param permission permission to update the expiration date
 * @returns a new permission object with the expiration date updated
 */
export function updateProgramExpirationDate(
  program: Program,
  expirationDate: Date,
  permission: Permission,
) {
  const _permission = { ...permission };
  _permission.majorEditingPermissions = _permission.majorEditingPermissions.map(
    (programEditPerm) => {
      const otherMajor = programEditPerm.major;
      if (
        otherMajor.name === program.name &&
        otherMajor.catalogYear === program.catalogYear
      ) {
        return {
          major: otherMajor,
          expirationDate: expirationDate,
        };
      } else {
        return programEditPerm;
      }
    },
  );
  return _permission;
}
