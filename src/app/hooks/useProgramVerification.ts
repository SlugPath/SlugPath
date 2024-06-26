import useMajorRequirements from "@/app/hooks/useMajorRequirements";
import { StoredCourse } from "@/app/types/Course";
import { PlannerData } from "@/app/types/Planner";
import { isRequirementList } from "@/lib/requirementsUtils";
import {
  Binder,
  Requirement,
  RequirementList,
  Requirements,
} from "@customTypes/Requirements";
import { useSession } from "next-auth/react";
import { v4 as uuid4 } from "uuid";

import { useUserPrograms } from "./reactQuery";

/**
 * Hook for updating and verifying major or minor requirements
 * @returns functions for updating and verifying major requirements
 */
export default function useProgramVerification() {
  const { data: session } = useSession();
  const { data: userPrograms } = useUserPrograms(session?.user.id);

  // TODO: remove useMajorRequirements and use react query instead
  const {
    onSetMajorRequirements,
    onSaveMajorRequirements,
    getRequirementsForMajor,
    getIsSaved,
    getLoadingSave,
  } = useMajorRequirements(userPrograms ?? [], session?.user.id);

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
      requirementListToUpdate.notes = requirementList.notes;
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
    if (!userPrograms) {
      return 0;
    }

    const percentages = userPrograms.map((major) => {
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
    function calcTotalPercentage() {
      if (percentages.length === 0) {
        return 0;
      } else {
        return (
          percentages.reduce((acc, percentage) => acc + percentage, 0) /
          percentages.length
        );
      }
    }

    const totalPercentage: number = calcTotalPercentage();

    return totalPercentage;
  }

  /**
   * Calculates the average major/minor percentages and individual program percentages.
   *
   * @param courseState The planner data containing course information.
   * @returns A dictionary containing the average major/minor percentages and
   * individual program percentages for each major/minor.
   */
  function calculateAllMajorProgressPercentages(courseState: PlannerData): {
    [key: string]: number;
  } {
    if (!userPrograms) {
      return {};
    }

    const percentages = userPrograms.map((major) => {
      const majorRequirements = getRequirementsForMajor(major.id);
      if (!majorRequirements) {
        return 0;
      } else {
        const requirementsTotal = majorRequirements.requirements.length;
        const requirementsSatisfied = majorRequirements.requirements.reduce(
          (count, requirement) =>
            isMajorRequirementsSatisfied(requirement, courseState.courses)
              ? count + 1
              : count,
          0,
        );
        const percentage: number =
          (requirementsSatisfied / requirementsTotal) * 100;
        return isNaN(percentage) ? 0 : percentage;
      }
    });

    // Check if percentages array is empty
    if (percentages.length === 0) {
      return {};
    }

    // Calculate average percentage
    const averagePercentage =
      percentages.length > 0
        ? percentages.reduce((acc, percentage) => acc + percentage, 0) /
          percentages.length
        : 0;

    // Construct result dictionary
    const result: { [key: string]: number } = { average: averagePercentage };
    userPrograms.forEach((major, index) => {
      result[major.id] = percentages[index];
    });
    return result;
  }

  return {
    userPrograms,
    updateRequirementList,
    addRequirementList,
    removeRequirementList,
    handleSaveMajorRequirements,
    calculateMajorProgressPercentage,
    calculateAllMajorProgressPercentages,
    getRequirementsForMajor,
    findRequirementList,
    isMajorRequirementsSatisfied,
    getIsSaved,
    getLoadingSave,
  };
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
