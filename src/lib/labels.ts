import { Label } from "@/app/types/Label";
import { v4 as uuid } from "uuid";

export const initialLabels = (): Label[] => {
  return [
    {
      id: uuid(),
      name: "",
      color: "RED",
    },
    {
      id: uuid(),
      name: "",
      color: "GREEN",
    },
    {
      id: uuid(),
      name: "",
      color: "BLUE",
    },
    {
      id: uuid(),
      name: "",
      color: "YELLOW",
    },
    {
      id: uuid(),
      name: "",
      color: "PURPLE",
    },
    {
      id: uuid(),
      name: "",
      color: "ORANGE",
    },
    {
      id: uuid(),
      name: "",
      color: "PINK",
    },
  ];
};

/**
 * Retrieves the color for a label
 * @param color is a string such as "red", "blue", "green", etc.
 * @returns a string that is the tailwindcss class for the color
 */
export function getColor(color: string) {
  switch (color.toLowerCase()) {
    case "red":
      return { backgroundColor: "#EF4444" };
    case "blue":
      return { backgroundColor: "#3B82F6" };
    case "green":
      return { backgroundColor: "#10B981" };
    case "yellow":
      return { backgroundColor: "#FBBF24" };
    case "orange":
      return { backgroundColor: "#F97316" };
    case "purple":
      return { backgroundColor: "#8B5CF6" };
    case "pink":
      return { backgroundColor: "#EC4899" };
    default:
      return { backgroundColor: "#6B7280" };
  }
}
