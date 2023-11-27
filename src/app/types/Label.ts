import { LabelColor } from "@prisma/client";

export interface Label {
  id: string;
  name: string;
  color: LabelColor;
}
