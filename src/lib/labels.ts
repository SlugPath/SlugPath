/**
 *
 * @param color is a string such as "red", "blue", "green", etc.
 * @returns a string that is the tailwindcss class for the color
 */
export function getColor(color: string): string {
  switch (color.toLowerCase()) {
    case "red":
      return "bg-red-500";
    case "blue":
      return "bg-blue-500";
    case "green":
      return "bg-green-500";
    case "yellow":
      return "bg-yellow-500";
    case "purple":
      return "bg-purple-500";
    case "pink":
      return "bg-pink-500";
    default:
      return "bg-gray-500";
  }
}
