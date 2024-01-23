import { Major } from "./Major";

export interface Permissions {
  userEmail: string;
  majorsAllowedToEdit: Major[];
}
