import { $Enums, Major } from "@prisma/client";

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: $Enums.Role;
  defaultPlannerId: string | null;
  majors?: Major[];
} | null;
