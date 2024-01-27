import { Major } from "./Major";

export interface Permissions {
  userEmail: string;
  majorEditingPermissions: MajorEditingPermission[];
}

export interface MajorEditingPermission {
  major: Major;
  expirationDate: Date;
}
