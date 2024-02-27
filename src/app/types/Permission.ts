import { Major } from "./Major";

export interface Permission {
  userEmail: string;
  majorEditingPermissions: MajorEditingPermission[];
}

/**
 * Having permission for one catalog year of a major means permission for all catalog years of that major
 * which is carried out by frontend logic.
 */
export interface MajorEditingPermission {
  major: Major;
  expirationDate: Date;
}
