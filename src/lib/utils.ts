import { StoredCourse } from "@/app/types/Course";
import { Course } from "@prisma/client";
import { isAlpha } from "class-validator";
import { v4 as uuidv4 } from "uuid";

/**
 * Zips two arrays together
 * @param arr1 First array
 * @param arr2 Second array
 * @returns zip of two arrays
 */
export const zip = (arr1: any[], arr2: any[]) => {
  return arr1.map((elem, index) => [elem, arr2[index]]);
};

// Utility function to truncate tab title

/**
 * Truncates a title to a certain length
 *
 * NOTE: There is also a tailwindCSS class for this (truncate)
 * @param title title to truncate
 * @param maxLength
 * @returns truncated title
 */
export const truncateTitle = (title: string, maxLength: number = 20) => {
  return title.length > maxLength
    ? `${title.substring(0, maxLength)}...`
    : title;
};

/**
 * Compares two course instances by number, and returns a
 * number representing the order in which they should appear.
 * @param a Course instance
 * @param b another Course instance
 * @returns -1 if a should appear before b, 1 if a should appear after b, 0 if they are equal
 */
export function compareCoursesByNum(a: StoredCourse, b: StoredCourse): number {
  // Check departments first
  if (a.departmentCode !== b.departmentCode)
    return a.departmentCode.localeCompare(b.departmentCode);

  // Check course numbers
  const aNum = parseInt(a.number.replace(/[A-Z]/g, ""));
  const bNum = parseInt(b.number.replace(/[A-Z]/g, ""));

  if (aNum > bNum) return 1;
  if (bNum > aNum) return -1;

  // Check letters for cases like 115A and 115B
  const aLastChar = a.number[a.number.length - 1];
  const aLet = isAlpha(aLastChar) ? aLastChar : "";

  const bLastChar = b.number[b.number.length - 1];
  const bLet = isAlpha(bLastChar) ? bLastChar : "";

  if (aLet == "" && bLet == "") return 0;
  if (aLet == "") return -1;
  if (bLet == "") return 1;

  if (aLet > bLet) return 1;
  if (bLet > aLet) return -1;

  return 0;
}

export function toStoredCourse({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  department: _,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prerequisites: __,
  ...rest
}: Course): StoredCourse {
  return {
    ...rest,
    description: rest.description ?? "",
    labels: [],
    id: uuidv4(),
  };
}

/**
 * Join an array of strings with a space (for use with tailwind classes)
 * @param {string[]} classes
 * @returns {string}
 */
export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
