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
