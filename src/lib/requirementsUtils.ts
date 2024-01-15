import { Binder, RequirementList } from "@/app/types/Requirements";

export const isRequirementList = (obj: any): obj is RequirementList => {
  return obj instanceof Object && "binder" in obj && "requirements" in obj;
};

export const isANDRequirement = (obj: any): obj is RequirementList => {
  return obj instanceof Object && obj.binder === Binder.AND;
};

export const isAtLeastRequirement = (obj: any): obj is RequirementList => {
  return (
    obj instanceof Object && obj.binder === Binder.AT_LEAST && "atLeast" in obj
  );
};

export const isStoredCourse = (obj: any): boolean => {
  return (
    "id" in obj &&
    "departmentCode" in obj &&
    "number" in obj &&
    "credits" in obj &&
    "title" in obj &&
    "ge" in obj &&
    "quartersOffered" in obj &&
    "labels" in obj
  );
};

/**
 * @param requirements is a RequirementList
 * @returns "0" if if requirements binder is AND, otherwise returns the atLeast value
 */
export function getBinderValue(requirements: RequirementList): string {
  if (requirements.binder === Binder.AND) {
    return "0";
  } else if (requirements.atLeast) {
    return requirements.atLeast.toString();
  }
  return "0";
}
