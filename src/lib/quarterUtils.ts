import { Quarter } from "@customTypes/Quarter";

export function getQuarterId(quarter: Quarter) {
  return `quarter-${quarter.year}-${quarter.title}`;
}
