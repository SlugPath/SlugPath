import { createContext, useContext } from "react";
import { MajorVerificationContextProps } from "../types/Context";
import { PlannerContext } from "./PlannerProvider";
import {
  Binder,
  Requirement,
  RequirementList,
  Requirements,
} from "../types/Requirements";
import { getUniqueCourses } from "@/lib/plannerUtils";
import { StoredCourse } from "../types/Course";
import { isRequirementList } from "@/lib/requirementsUtils";
import { v4 as uuid4 } from "uuid";
import useMajorSelection from "../hooks/useMajorSelection";
import { useSession } from "next-auth/react";
import useMajorRequirements from "@/app/hooks/useMajorRequirements";

export const MajorVerificationContext = createContext(
  {} as MajorVerificationContextProps,
);

export function MajorVerificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { courseState } = useContext(PlannerContext);
  const { data: session } = useSession();
  const { userMajorData } = useMajorSelection(session?.user.id);
  const { majorRequirements, setMajorRequirements, saveMajorRequirements } =
    useMajorRequirements(userMajorData?.id);

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
      if (requirementList.atLeast) {
        requirementListToUpdate.atLeast = requirementList.atLeast;
      }
    }

    setMajorRequirements(majorRequirementsCopy);
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

    setMajorRequirements(majorRequirementsCopy);
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

    setMajorRequirements(majorRequirementsCopy);
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
    saveMajorRequirements(majorRequirements, userMajorData.id);
  }

  const majorIsVerified = courseState
    ? isMajorRequirementsSatisfied(
        csMajorRequirements,
        getUniqueCourses(courseState.courses),
      )
    : false;

  return (
    <MajorVerificationContext.Provider
      value={{
        isMajorRequirementsSatisfied: isMajorRequirementsSatisfied,
        majorRequirements: majorRequirements,
        majorIsVerified,
        errors: "",
        findRequirementList,
        addRequirementList,
        removeRequirementList,
        updateRequirementList,
        handleSaveMajorRequirements,
      }}
    >
      {children}
    </MajorVerificationContext.Provider>
  );
}

const csMajorRequirements: RequirementList = {
  binder: Binder.AND,
  id: uuid4(),
  title: "Computer Science BS Requirements",
  requirements: [
    {
      binder: Binder.AND,
      id: uuid4(),
      title: "Lower Division Courses",
      requirements: [
        // {
        //   departmentCode: "CSE",
        //   number: "12",
        // },
        // {
        //   departmentCode: "CSE",
        //   number: "16",
        // },
        // {
        //   departmentCode: "CSE",
        //   number: "20",
        // },
        // {
        //   departmentCode: "CSE",
        //   number: "30",
        // },
        // {
        //   departmentCode: "CSE",
        //   number: "13S",
        // },
      ],
    },
    {
      binder: Binder.OR,
      id: uuid4(),
      title: "Mathematics",
      requirements: [
        {
          binder: Binder.AND,
          id: uuid4(),
          requirements: [
            // {
            //   departmentCode: "MATH",
            //   number: "19A",
            // },
            // {
            //   departmentCode: "MATH",
            //   number: "19B",
            // },
          ],
        },
        {
          binder: Binder.AND,
          id: uuid4(),
          requirements: [
            // {
            //   departmentCode: "MATH",
            //   number: "20A",
            // },
            // {
            //   departmentCode: "MATH",
            //   number: "20B",
            // },
          ],
        },
      ],
    },
    {
      binder: Binder.AND,
      id: uuid4(),
      title: "Applied Mathematics",
      requirements: [
        {
          binder: Binder.OR,
          id: uuid4(),
          requirements: [
            // {
            //   departmentCode: "AM",
            //   number: "10",
            // },
            // {
            //   departmentCode: "MATH",
            //   number: "21",
            // },
          ],
        },
        {
          binder: Binder.OR,
          id: uuid4(),
          requirements: [
            // {
            //   departmentCode: "AM",
            //   number: "30",
            // },
            // {
            //   departmentCode: "MATH",
            //   number: "23A",
            // },
          ],
        },
      ],
    },
    {
      binder: Binder.AND,
      id: uuid4(),
      title: "Engineering Science",
      requirements: [
        // {
        //   departmentCode: "ECE",
        //   number: "30",
        // },
      ],
    },
  ],
};

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
