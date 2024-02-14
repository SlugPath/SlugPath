import useMajorRequirements from "@/app/hooks/useMajorRequirements";
import { isRequirementList } from "@/lib/requirementsUtils";
import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";
import { v4 as uuid4 } from "uuid";

import { MajorVerificationContextProps } from "../types/Context";
import { StoredCourse } from "../types/Course";
import { PlannerData } from "../types/Planner";
import {
  Binder,
  Requirement,
  RequirementList,
  Requirements,
} from "../types/Requirements";
import { DefaultPlannerContext } from "./DefaultPlannerProvider";

export const MajorVerificationContext = createContext(
  {} as MajorVerificationContextProps,
);

export function MajorVerificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { userMajors } = useContext(DefaultPlannerContext);
  const {
    onSetMajorRequirements,
    onSaveMajorRequirements,
    getRequirementsForMajor,
    getIsSaved,
    getLoadingSave,
  } = useMajorRequirements(userMajors, session?.user.id);

  function updateRequirementList(
    majorId: number,
    id: string,
    requirementList: RequirementList,
  ) {
    const majorRequirementsCopy = getRequirementsForMajor(majorId);
    if (!majorRequirementsCopy) {
      return;
    }

    const requirementListToUpdate = findRequirementList(
      id,
      majorRequirementsCopy,
    );

    if (requirementListToUpdate) {
      requirementListToUpdate.requirements = requirementList.requirements;
      requirementListToUpdate.title = requirementList.title;
      requirementListToUpdate.binder = requirementList.binder;
      if (requirementList.atLeast) {
        requirementListToUpdate.atLeast = requirementList.atLeast;
      }
    }

    onSetMajorRequirements(majorId, majorRequirementsCopy);
  }

  function addRequirementList(
    majorId: number,
    parentRequirementListId: string,
  ) {
    const majorRequirementsCopy = getRequirementsForMajor(majorId);
    if (!majorRequirementsCopy) {
      return;
    }

    const newRequirementList: RequirementList = {
      binder: Binder.AND,
      title: "New Requirement List",
      id: uuid4(),
      requirements: [],
    };

    const parentRequirementList = findRequirementList(
      parentRequirementListId,
      majorRequirementsCopy,
    );

    if (parentRequirementList) {
      parentRequirementList.requirements.push(newRequirementList);
    }

    onSetMajorRequirements(majorId, majorRequirementsCopy);
  }

  function removeRequirementList(majorId: number, id: string) {
    const majorRequirementsCopy = getRequirementsForMajor(majorId);
    if (!majorRequirementsCopy) {
      return;
    }

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

    onSetMajorRequirements(majorId, majorRequirementsCopy);
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

  function handleSaveMajorRequirements(majorId: number) {
    onSaveMajorRequirements(majorId);
  }

  function calculateMajorProgressPercentage(courseState: PlannerData): number {
    const percentages = userMajors.map((major) => {
      const majorRequirements = getRequirementsForMajor(major.id);
      if (!majorRequirements) {
        return 0;
      }

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
    });

    // average the percentages
    return (
      percentages.reduce((acc, percentage) => acc + percentage, 0) /
      percentages.length
    );
  }

  return (
    <MajorVerificationContext.Provider
      value={{
        isMajorRequirementsSatisfied: isMajorRequirementsSatisfied,
        getRequirementsForMajor,
        getLoadingSave,
        getIsSaved,
        calculateMajorProgressPercentage: calculateMajorProgressPercentage,
        errors: "",
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
