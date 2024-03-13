import { Program } from "./Program";

export interface Permission {
  userEmail: string;
  majorEditingPermissions: MajorEditingPermission[];
}

/**
 * Having permission for one catalog year of a major means permission for all catalog years of that major
 * which is carried out by frontend logic.
 */
export interface MajorEditingPermission {
  major: Program;
  expirationDate: Date;
}
