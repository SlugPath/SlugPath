import { isRequirementList } from "@/lib/requirementsUtils";
import { StoredCourse } from "@customTypes/Course";
import { PlannerData } from "@customTypes/Planner";
import {
  Binder,
  Requirement,
  RequirementList,
  Requirements,
} from "@customTypes/Requirements";
import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";
import { v4 as uuid4 } from "uuid";

import { DefaultPlannerContext } from "../DefaultPlannerProvider";
import { MajorVerificationContextProps } from "./Types";
import useMajorRequirements from "./useMajorRequirements";

export const MajorVerificationContext = createContext(
  {} as MajorVerificationContextProps,
);

export function MajorVerificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { userMajorData } = useContext(DefaultPlannerContext);
  const {
    loadingSave,
    isSaved,
    majorRequirements,
    onSetMajorRequirements,
    onSaveMajorRequirements,
  } = useMajorRequirements(userMajorData?.id, session?.user.id);

  function updateRequirementList(id: string, requirementList: RequirementList) {
    const majorRequirementsCopy = { ...majorRequirements };
    const requirementListToUpdate = findRequirementList(
      id,
      majorRequirementsCopy,
    );

    if (requirementListToUpdate) {
      requirementListToUpdate.requirements = requirementList.requirements;
      requirementListToUpdate.title = requirementList.title;
      requirementListToUpdate.binder = requirementList.binder;
      requirementListToUpdate.notes = requirementList.notes;
      if (requirementList.atLeast) {
        requirementListToUpdate.atLeast = requirementList.atLeast;
      }
    }

    onSetMajorRequirements(majorRequirementsCopy);
  }

  function addRequirementList(parentRequirementListId: string) {
    const newRequirementList: RequirementList = {
      binder: Binder.AND,
      title: "New Requirement List",
      id: uuid4(),
      requirements: [],
    };

    const majorRequirementsCopy = { ...majorRequirements };
    const parentRequirementList = findRequirementList(
      parentRequirementListId,
      majorRequirementsCopy,
    );

    if (parentRequirementList) {
      parentRequirementList.requirements.push(newRequirementList);
    }

    onSetMajorRequirements(majorRequirementsCopy);
  }

  function removeRequirementList(id: string) {
    const majorRequirementsCopy = { ...majorRequirements };
    const requirementList = findRequirementList(id, majorRequirementsCopy);

    if (requirementList) {
      const requirementListParent = findRequirementListParent(
        id,
        majorRequirementsCopy,
      );
      if (requirementListParent) {
        requirementListParent.requirements =
          requirementListParent.requirements.filter((requirement) => {
            if (isRequirementList(requirement)) {
              return requirement.id !== id;
            }
            return true;
          });
      }
    }

    onSetMajorRequirements(majorRequirementsCopy);
  }

  function findRequirementList(
    id: string,
    requirements: RequirementList,
  ): RequirementList | null {
    if (requirements.id === id) {
      return requirements;
    }

    for (const requirement of requirements.requirements) {
      if (isRequirementList(requirement)) {
        const requirementList = findRequirementList(id, requirement);
        if (requirementList) {
          return requirementList;
        }
      }
    }

    return null;
  }

  function findRequirementListParent(
    id: string,
    requirements: RequirementList,
  ): RequirementList | null {
    if (requirements.id === id) {
      return null;
    }

    for (const requirement of requirements.requirements) {
      if (isRequirementList(requirement)) {
        if (requirement.id === id) {
          return requirements;
        }

        const requirementList = findRequirementListParent(id, requirement);
        if (requirementList) {
          return requirementList;
        }
      }
    }

    return null;
  }

  function handleSaveMajorRequirements() {
    onSaveMajorRequirements(userMajorData!.id);
  }

  function calculateMajorProgressPercentage(courseState: PlannerData): number {
    const requirementsTotal = majorRequirements.requirements.length;

    const requirementsSatisfied = majorRequirements.requirements.reduce(
      (acc, requirement) =>
        isMajorRequirementsSatisfied(requirement, courseState.courses)
          ? acc + 1
          : acc,
      0,
    );

    const percentage: number =
      (requirementsSatisfied / requirementsTotal) * 100;
    return isNaN(percentage) ? 0 : percentage;
  }

  return (
    <MajorVerificationContext.Provider
      value={{
        isMajorRequirementsSatisfied,
        majorRequirements,
        calculateMajorProgressPercentage,
        errors: "",
        loadingSave,
        isSaved,
        findRequirementList,
        addRequirementList,
        removeRequirementList,
        updateRequirementList,
        onSaveMajorRequirements: handleSaveMajorRequirements,
      }}
    >
      {children}
    </MajorVerificationContext.Provider>
  );
}

// Helper functions
function isMajorRequirementsSatisfied(
  requirements: Requirements,
  courses: StoredCourse[],
): boolean {
  if (isRequirementList(requirements)) {
    if (requirements.binder === Binder.AND) {
      return andRequirementsSatisfied(requirements, courses);
    } else if (requirements.binder === Binder.AT_LEAST) {
      const atLeast = requirements.atLeast ? requirements.atLeast : 1;
      return atLeastXCoursesSatisfied(atLeast, requirements, courses);
    } else {
      return atLeastXCoursesSatisfied(1, requirements, courses);
    }
  } else {
    return courseRequirementSatisfied(requirements, courses);
  }
}

function andRequirementsSatisfied(
  requirements: RequirementList,
  courses: StoredCourse[],
): boolean {
  for (const requirement of requirements.requirements) {
    if (!isMajorRequirementsSatisfied(requirement, courses)) {
      return false;
    }
  }
  return true;
}

function atLeastXCoursesSatisfied(
  x: number,
  requirements: RequirementList,
  courses: StoredCourse[],
) {
  let numCoursesSatisfied = 0;

  for (const requirement of requirements.requirements) {
    if (isMajorRequirementsSatisfied(requirement, courses)) {
      numCoursesSatisfied++;
    }
  }

  return numCoursesSatisfied >= x;
}

function courseRequirementSatisfied(
  courseRequirement: Requirement,
  courses: StoredCourse[],
) {
  for (const course of courses) {
    if (
      courseRequirement.departmentCode === course.departmentCode &&
      courseRequirement.number === course.number
    ) {
      return true;
    }
  }
  return false;
}
