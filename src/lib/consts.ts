import { SearchParams } from "@/app/types/Course";

export const MAX_VISIBLE_COURSE_TITLE = 15;
export const MAX_STORED_COURSE_TITLE = 50;
export const MAX_LABEL_NAME = 25;
export const geOptions = [
  { label: "--", value: null },
  { label: "C", value: "c" },
  { label: "CC", value: "cc" },
  { label: "ER", value: "er" },
  { label: "IM", value: "im" },
  { label: "MF", value: "mf" },
  { label: "SI", value: "si" },
  { label: "SR", value: "sr" },
  { label: "TA", value: "ta" },
  /* Include options for PE subcategories */
  { label: "PE-T", value: "peT" },
  { label: "PE-H", value: "peH" },
  { label: "PE-E", value: "peE" },
  /* Include options for PR subcategories */
  { label: "PR-C", value: "prC" },
  { label: "PR-E", value: "prE" },
  { label: "PR-S", value: "prS" },
] as SearchParams;

export const REQUIREMENT_LIST_DROPPABLE_PREFIX = "requirement-list-";
export const SEARCH_DROPPABLE = "search-droppable";
export const CUSTOM_DROPPABLE = "custom-droppable";
