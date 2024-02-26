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
export const terms = [
  // 23-24 Catalog Year
  { id: 2238, title: "Fall", catalogYear: "23-24" },
  { id: 2240, title: "Winter", catalogYear: "23-24" },
  { id: 2242, title: "Spring", catalogYear: "23-24" },
  { id: 2244, title: "Summer", catalogYear: "23-24" },

  // 22-23 Catalog Year
  { id: 2228, title: "Fall", catalogYear: "22-23" },
  { id: 2230, title: "Winter", catalogYear: "22-23" },
  { id: 2232, title: "Spring", catalogYear: "22-23" },
  { id: 2234, title: "Summer", catalogYear: "22-23" },

  // 21-22 Catalog Year
  { id: 2218, title: "Fall", catalogYear: "21-22" },
  { id: 2220, title: "Winter", catalogYear: "21-22" },
  { id: 2222, title: "Spring", catalogYear: "21-22" },
  { id: 2224, title: "Summer", catalogYear: "21-22" },

  // 20-21 Catalog Year
  { id: 2208, title: "Fall", catalogYear: "20-21" },
  { id: 2210, title: "Winter", catalogYear: "20-21" },
  { id: 2212, title: "Spring", catalogYear: "20-21" },
  { id: 2214, title: "Summer", catalogYear: "20-21" },
] as const;
export const REQUIREMENT_LIST_DROPPABLE_PREFIX = "requirement-list-";
export const SEARCH_DROPPABLE = "search-droppable";
export const CUSTOM_DROPPABLE = "custom-droppable";
export const REPLACE_CUSTOM_DROPPABLE = "replace-custom-droppable";
