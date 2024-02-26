import { Major } from "./Major";

export interface Permission {
  userEmail: string;
  majorEditingPermissions: MajorEditingPermission[];
}

export interface MajorEditingPermission {
  major: Major;
  expirationDate: Date;
}
