import { Binder, Requirements } from "../app/ts-types/Requirements";

export function getRequirementsLength(requirements: Requirements): number {
  if (typeof requirements === "string") {
    return 1;
  } else {
    return requirements.requirements.reduce(
      (acc, curr) => acc + getRequirementsLength(curr),
      0,
    );
  }
}

// CURRENTLY: will only return the courses, and nothing about the requirements groups
export function getCoursesFromRequirements(
  requirements: Requirements,
): string[] {
  if (typeof requirements === "string") {
    return [requirements];
  } else {
    const listOfCourses: string[] = [];
    requirements.requirements.forEach((requirement: Requirements) => {
      if (typeof requirement === "string") {
        listOfCourses.push(requirement);
      } else {
        const courses = getCoursesFromRequirements(requirement);
        listOfCourses.push(createOrRequirementsString(courses));
      }
      // TODO: handle the case where the requirement is a group
    });
    return listOfCourses;
  }
}

export function createOrRequirementsString(courses: string[]): string {
  let requirementName: string = "";
  courses.forEach((course: string, index: number) => {
    if (index === courses.length - 1) {
      requirementName += course;
    } else {
      requirementName += course + " or ";
    }
  });
  return requirementName;
}

export function getBinderFromRequirements(requirements: Requirements): Binder {
  if (typeof requirements === "object") {
    return requirements.binder;
  } else {
    return Binder.AND;
  }
}

export function courseHasRequirement(
  course: string,
  requirement: string,
  prerequisites: any,
): boolean {
  if (typeof prerequisites[course] === "object") {
    const requirements: Requirements = prerequisites[course];
    const someCourses = getCoursesFromRequirements(requirements);
    return someCourses.includes(requirement);
  } else if (typeof prerequisites[course] === "string") {
    return prerequisites[course] === requirement;
  }
  return false;
}

export function removeCoursesWhoseSiblingsHaveItAsRequirement(
  courses: string[],
  prerequisites: any,
): string[] {
  return courses.filter((course: string) => {
    let anyNeighborsHaveRequirement: boolean = false;
    courses.forEach((otherCourse: string) => {
      if (courseHasRequirement(otherCourse, course, prerequisites)) {
        anyNeighborsHaveRequirement = true;
      }
    });
    return !anyNeighborsHaveRequirement;
  });
}
