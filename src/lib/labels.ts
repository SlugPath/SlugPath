/**
 *
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
