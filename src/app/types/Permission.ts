import { Program } from "./Program";

export interface Permission {
  userEmail: string;
  majorEditingPermissions: ProgramEditingPermission[]; // TODO: change to ProgramEditingPermission in Database
}

/**
 * Having permission for one catalog year of a major means permission for all catalog years of that major
 * which is carried out by frontend logic.
 */
export interface ProgramEditingPermission {
  major: Program; // TODO: change to program in Database
  expirationDate: Date;
}
