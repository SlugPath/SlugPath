import { StoredCourse } from "@/app/types/Course";
import { Label } from "@/app/types/Label";
import { PlannerData } from "@/app/types/Planner";
import { Quarter } from "@customTypes/Quarter";
import { Term } from "@customTypes/Quarter";
import { LabelColor } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { initialLabels } from "./labels";

const quarterNames: Term[] = ["Fall", "Winter", "Spring", "Summer"];
export const DEFAULT_PROGRAM_YEAR_COUNT = 4;
export const QUARTERS_PER_YEAR = 4;
export const EMPTY_PLANNER_ID = "emptyPlanner";

/**
 * Creates a new PlannerData instance with default values
 * @returns a new PlannerData instance
 */
export const initializeNewPlanner = (): PlannerData => {
  return {
    quarters: initializeQuarters(),
    years: DEFAULT_PROGRAM_YEAR_COUNT,
    courses: [],
    labels: initialLabels(),
    notes: "",
    title: "New Planner",
    id: uuidv4(),
  };
};

/**
 * Creates a new PlannerData instance with default values
 * @returns a new PlannerData instance with empty values
 */
export const initializeEmptyPlanner = (): PlannerData => {
  return {
    quarters: [],
    years: DEFAULT_PROGRAM_YEAR_COUNT,
    courses: [],
    labels: [],
    notes: "",
    id: uuidv4(),
    title: "",
  };
};

/**
 * Creates a new Quarters instance with default number of years and quarters per
 * year
 * @returns an array of Quarter objects
 */
export function initializeQuarters() {
  const quarters: Quarter[] = [];
  for (let year = 0; year < DEFAULT_PROGRAM_YEAR_COUNT; year++) {
    for (let quarter = 0; quarter < QUARTERS_PER_YEAR; quarter++) {
      quarters.push({
        year,
        title: `${quarterNames[quarter]}`,
        courses: [],
      });
    }
  }

  return quarters;
}

/**
 * Creates an empty custom course
 * @returns a new StoredCourse instance
 */
export const initializeCustomCourse = (): StoredCourse => {
  return {
    id: uuidv4(),
    credits: 5,
    departmentCode: "",
    number: "",
    title: "Custom Course",
    ge: [],
    quartersOffered: ["Fall", "Winter", "Spring"],
    description: "",
    labels: [],
  };
};

/**
 * Displays department code and number if they exist, otherwise displays title
 * @param param0 a stored course
 * @returns a string that represents the course
 */
export function courseTitle({
  departmentCode,
  number,
  title,
}: StoredCourse): string {
  if (departmentCode !== "" && number !== "") {
    return `${departmentCode} ${number}`;
  }
  return `${title}`;
}

/**
 * Stringifies a course
 * @param course a stored course and a suffix
 * @returns  a string that represents the course
 */
export function createCourseDraggableId(
  course: StoredCourse & { suffix: string },
) {
  return JSON.stringify(course);
}

/**
 * Returns the real equivalent of a course if it exists.
 * Otherwise it returns a custom course with the custom title.
 * For use with seeding default planners
 * @param title title of the course
 */
export async function getRealEquivalent(
  prisma: any,
  title: string,
): Promise<StoredCourse> {
  const regex = /^[A-Z]{1,5} [0-9]{1,3}[A-Z]?$/;

  if (!regex.test(title)) {
    return {
      ...initializeCustomCourse(),
      title,
    };
  }

  const [dept, num] = title.split(" ");
  const equivalent = await prisma.course.findFirst({
    where: {
      departmentCode: dept,
      number: num,
    },
  });

  // Should not happen
  if (equivalent === null) {
    return {
      ...initializeCustomCourse(),
      title,
    };
  }

  return {
    ...initializeCustomCourse(),
    title: equivalent.title,
    departmentCode: equivalent.departmentCode,
    number: equivalent.number,
    credits: equivalent.credits,
    ge: equivalent.ge,
    quartersOffered: equivalent.quartersOffered,
  };
}

/**
 * Finds a course with a given id in a planner
 * @param planner a planner
 * @param id course id
 * @returns the course with the given id, or throws an error if not found
 */
export function findCourseById(planner: PlannerData, id: string): StoredCourse {
  const course = planner.courses.find((c) => c.id === id);
  if (course === undefined)
    throw new Error(
      `course ${id} not found in ${JSON.stringify(planner, null, 2)}`,
    );
  return course;
}

/**
 * Finds all StoredCourses in a quarter
 * @param planner a planner
 * @param quarter a quarter
 * @returns a list of courses in the quarter
 */
export function findCoursesInQuarter(
  planner: PlannerData,
  quarter: Quarter,
): StoredCourse[] {
  return quarter.courses.map((cid) => findCourseById(planner, cid));
}

/**
 * Checks if a course is a custom course
 * @param c a StoredCourse
 * @returns true if the course is a custom course
 */
export function isCustomCourse(c: StoredCourse): boolean {
  const { departmentCode, number } = c;
  return departmentCode === "" || number === "";
}

/**
 * Initializes a StoredCourse from a stringified course
 * @param stringifiedCourse a stringified course
 * @returns a StoredCourse
 */
export function initalizeCourseFromStringifiedId(
  stringifiedCourse: string,
): Omit<StoredCourse, "id"> {
  try {
    const course = JSON.parse(stringifiedCourse);
    return {
      title: course.title,
      departmentCode: course.departmentCode,
      number: course.number,
      quartersOffered: course.quartersOffered,
      credits: course.credits,
      description: course.description ?? "",
      ge: course.ge,
      labels: [],
    };
  } catch (e) {
    throw new Error(`Invalid course id ${stringifiedCourse}`);
  }
}

/**
 * Finds the StoredCourse that matches an id
 * @param cid is the id of the course to find
 * @param planner is the planner state
 * @returns a StoredCourse or undefined
 */
export function findCourseFromPlanner(cid: string, planner: PlannerData) {
  const found = planner.courses.find((c) => c.id === cid);
  if (!found) throw new Error("couldn't find course with matching cid");
  return found;
}

/**
 *
 * @param courses is a list of courses
 * @returns courses with duplicates removed
 */
export function findUniqueCourses(courses: StoredCourse[]): StoredCourse[] {
  const uniqueCourses = new Map();

  for (const course of courses) {
    const key = `${course.departmentCode}|${course.number}|${course.title}|${course.credits}`;
    if (!uniqueCourses.has(key)) {
      uniqueCourses.set(key, course);
    }
  }

  return Array.from(uniqueCourses.values());
}

/**
 * Computes the total credits for courses
 * @param courses is a list of courses
 * @returns total number of credits not including repeated courses
 */
export function findTotalCredits(courses: StoredCourse[]): number {
  const uniqueCourses = findUniqueCourses(courses);
  return uniqueCourses.reduce((accumulatedCredits, course) => {
    return accumulatedCredits + course.credits;
  }, 0);
}

/**
 * @param courseState is the state of the course planner
 * @returns every GE in courses in courseState mapped to the courses that satisfy it
 */
export function GESMappedToCourses({
  courseState,
}: {
  courseState: PlannerData;
}) {
  const mapOfGeToCourses = new Map<string, string[]>();
  for (const course of courseState.courses) {
    if (course.ge.length > 0 && course.ge[0] !== "None") {
      for (let ge of course.ge) {
        // replaces pe-x with pe and pr-x with pr, where x is some letter
        if (ge.includes("pe")) {
          ge = "pe";
        } else if (ge.includes("pr")) {
          ge = "pr";
        }

        if (mapOfGeToCourses.has(ge)) {
          const courses = mapOfGeToCourses.get(ge);
          if (courses !== undefined) {
            courses.push(course.departmentCode + " " + course.number);
            mapOfGeToCourses.set(ge, courses);
          }
        } else {
          mapOfGeToCourses.set(ge, [
            course.departmentCode + " " + course.number,
          ]);
        }
      }
    }
  }
  return mapOfGeToCourses;
}

/**
 * @param ge is a list of GEs
 * @returns a list containing a label for the first GE in ge
 */
export function geLabels(ge: string[]): Label[] {
  if (ge.length > 0 && ge[0] !== "None") {
    const geLabel = {
      id: "ge",
      name: "GE",
      color: LabelColor.GREEN,
    };
    return [geLabel];
  }
  return [];
}

/**
 * Returns a list of all the satisfied GE's in a planner
 * @param planner a course planner object
 * @returns list of GEs satisfied
 */
export function getGeSatisfied(planner: PlannerData): string[] {
  return planner.courses.flatMap((c) => c.ge);
}

/**
 * Checks if a course is offered in a term
 * @param quartersOffered is a list of quarters a course is offered in
 * @param term a term to check if the course is offered in
 * @returns true if the course is offered in the term, false otherwise
 */
export function isOffered(
  quartersOffered: string[],
  term: Term | undefined,
): boolean {
  if (term === undefined) return true;
  return quartersOffered.find((t) => (t as Term) == term) !== undefined;
}

/**
 * Copies a PlannerData, but changes the id's of the courses within the planner
 * to prevent data inconsistencies
 * Also adds a value for notes
 * Copies labels over as well
 * @param sourcePlanner a planner
 * @returns a unique PlannerData instance
 */
export function clonePlanner(sourcePlanner: PlannerData): PlannerData {
  const clone = { ...sourcePlanner };

  const sourceLabels = clone.labels;

  // Create a lookup table between old ids and newStoredCourse
  const lookup = {} as any;
  sourcePlanner.courses.forEach((c) => {
    lookup[c.id] = { ...c, id: uuidv4() };
  });

  clone.labels = initialLabels();

  // Create a mapping between old and new label IDs
  // AND Transfer names from sourceLabels to clone.labels
  const labelMapping = {} as any;
  sourceLabels.forEach((sourceLabel, index) => {
    labelMapping[sourceLabel.id] = clone.labels[index].id;
    clone.labels[index].name = sourceLabel.name;
  });

  // Pass the new Stored courses to the clone with updated labels
  clone.courses = Object.values(lookup).map((course: any) => ({
    ...course,
    labels: course.labels.map(
      (sourceLabelId: string) => labelMapping[sourceLabelId] || sourceLabelId,
    ),
  }));

  // Replace all the references in the quarters to course ids with their new
  // counterparts
  clone.quarters = sourcePlanner.quarters.map((q) => {
    return {
      ...q,
      courses: q.courses.map((crs) => {
        return lookup[crs].id;
      }),
    };
  });

  return clone;
}

/**
 * Copies a PlannerData, but changes the id's of the courses within the planner
 * to prevent data inconsistencies
 * Also adds a value for notes
 * @param defaultPlanner a defaultPlanner
 * @returns a unique PlannerData instance
 */
export function cloneDefaultPlanner(defaultPlanner: PlannerData): PlannerData {
  const clone = { ...defaultPlanner };

  // Create a lookup table between old ids and newStoredCourse
  const lookup = {} as any;
  defaultPlanner.courses.forEach((c) => {
    lookup[c.id] = { ...c, id: uuidv4() };
  });
  // Pass the new Stored courses to the clone
  clone.courses = Object.values(lookup);

  // Replace all the references in the quarters to course ids with their new
  // counterparts
  clone.quarters = defaultPlanner.quarters.map((q) => {
    return {
      ...q,
      courses: q.courses.map((crs) => {
        return lookup[crs].id;
      }),
    };
  });
  clone.labels = initialLabels();
  return clone;
}

/**
 * Converts a Planner from the database to a PlannerData type
 * @param planner planner from the database
 * @returns a PlannerData instance
 */
export function toPlannerData(planner: any): PlannerData {
  // Set all the courses for each quarter
  const newPlanner: PlannerData = JSON.parse(
    JSON.stringify(initializeEmptyPlanner()),
  );
  const allCourses: StoredCourse[] = [];
  planner?.quarters.forEach((q: any) => {
    const courseIds: string[] = q.courses.map((c: StoredCourse) => c.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const courses = q.courses.map(({ quarterId: _, ...rest }: any) => {
      return {
        ...rest,
        quartersOffered: rest.quartersOffered.map((q: any) => q as Term),
        ge: rest.ge.map((g: any) => g as string),
      };
    });
    allCourses.push(...courses);
    newPlanner.quarters.push({
      year: q.year,
      title: q.term,
      courses: courseIds,
    });
  });

  newPlanner.labels = [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...planner.labels.map(({ plannerId: _, ...l }: any) => l),
  ];
  newPlanner.notes = planner.notes ? planner.notes : "";
  newPlanner.courses = allCourses;
  newPlanner.title = planner.title;
  newPlanner.id = planner.id;

  // Return new modified planner
  return newPlanner;
}
