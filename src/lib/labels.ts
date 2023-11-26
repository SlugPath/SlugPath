import { Label } from "@/app/types/Label";

export const initialLabels: Label[] = [
  {
    id: "1",
    name: "",
    color: "RED",
  },
  {
    id: "2",
    name: "",
    color: "GREEN",
  },
  {
    id: "3",
    name: "",
    color: "BLUE",
  },
  {
    id: "4",
    name: "",
    color: "YELLOW",
  },
  {
    id: "5",
    name: "",
    color: "PURPLE",
  },
  {
    id: "6",
    name: "",
    color: "ORANGE",
  },
  {
    id: "7",
    name: "",
    color: "PINK",
  },
];

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
