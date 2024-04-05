import { Quarter } from "@customTypes/Quarter";
import { Term } from "@prisma/client";

/**
 * Constructs a quarter id
 * @param quarter a quarter object
 * @returns a string that represents the id of the quarter
 */
export function constructQuarterId(quarter: Quarter) {
  return `quarter-${quarter.year}-${quarter.title}`;
}

/**
 * Extracts the term from a quarter ID
 * @param quarterId quarter Id of the format `quarter-{year}-{term}`
 * @returns term name
 */
export function extractTermFromQuarterId(
  quarterId: string | undefined,
): Term | undefined {
  if (quarterId === undefined) return undefined;

  const tokens = quarterId.split("-");
  const term = tokens[tokens.length - 1];
  if (
    term !== "Fall" &&
    term !== "Winter" &&
    term !== "Spring" &&
    term !== "Summer"
  ) {
    return undefined;
  }
  return term as Term;
}

/**
 * Finds a quarter with a given id in an array of `Quarter`
 * @param quarters array of quarters in a `CourseState` instance
 * @param id quarter id
 * @returns quarter and index where it was located
 */
export function findQuarter(
  quarters: Quarter[],
  id: string,
): { quarter: Quarter; idx: number } {
  const quarter = quarters.find((q) => constructQuarterId(q) == id);
  const idx = quarters.findIndex((q) => constructQuarterId(q) == id);
  if (quarter === undefined) throw new Error(`invalid quarter id: ${id}`);
  return { quarter, idx };
}

/**
 * Looks up a color based on the quarter title
 * @param title a quarter title
 * @returns a color based on the quarter title
 */
export function lookupQuarterColor(
  title: "Fall" | "Winter" | "Spring" | "Summer",
) {
  let color: "warning" | "primary" | "success" | "danger";
  switch (title) {
    case "Fall":
      color = "warning";
      break;
    case "Winter":
      color = "primary";
      break;
    case "Spring":
      color = "success";
      break;
    default:
      color = "danger";
  }
  return color;
}
