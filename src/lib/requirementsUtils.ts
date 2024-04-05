import { storedCourseSchema } from "@/app/types/Course";
import { Binder, RequirementList } from "@/app/types/Requirements";

/**
 * Checks if obj is a RequirementList
 * @param obj unknown object
 * @returns true if obj is a RequirementList, false otherwise
 */
export const isRequirementList = (obj: any): obj is RequirementList => {
  return obj instanceof Object && "binder" in obj && "requirements" in obj;
};

/**
 * Checks if obj is a RequirementList with a binder of AND
 * @param obj unknown object
 * @returns true if obj is a RequirementList with a binder of AND, false otherwise
 */
export const isANDRequirement = (obj: any): obj is RequirementList => {
  return obj instanceof Object && obj.binder === Binder.AND;
};

/**
 * Checks if obj is a RequirementList with a binder of AT_LEAST
 * @param obj unknown object
 * @returns true if obj is a RequirementList with a binder of AT_LEAST, false otherwise
 */
export const isAtLeastRequirement = (obj: any): obj is RequirementList => {
  return (
    obj instanceof Object && obj.binder === Binder.AT_LEAST && "atLeast" in obj
  );
};

/**
 * Checks if obj is a StoredCourse
 * @param obj unknown object
 * @returns true if obj is a StoredCourse, false otherwise
 */
export const isStoredCourse = (obj: any): boolean => {
  const { success } = storedCourseSchema.safeParse(obj);
  return success;
};

/**
 * Finds the value of the binder in the requirements
 * @param requirements is a RequirementList
 * @returns "0" if if requirements binder is AND, otherwise returns the atLeast value
 */
export function findBinderValue(requirements: RequirementList): string {
  if (requirements.binder === Binder.AND) {
    return "0";
  } else if (requirements.atLeast) {
    return requirements.atLeast.toString();
  }
  return "0";
}
