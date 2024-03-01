import { Quarter } from "@customTypes/Quarter";

export function getQuarterId(quarter: Quarter) {
  return `quarter-${quarter.year}-${quarter.title}`;
}

export function getQuarterColor(
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
