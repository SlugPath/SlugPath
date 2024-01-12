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

export const MajorVerificationContext = createContext(
  {} as MajorVerificationContextProps,
);

export function MajorVerificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { courseState } = useContext(PlannerContext);

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
        majorRequirements: csMajorRequirements,
        majorIsVerified,
        errors: "",
      }}
    >
      {children}
    </MajorVerificationContext.Provider>
  );
}

const csMajorRequirements: RequirementList = {
  binder: Binder.AND,
  title: "Computer Science BS Requirements",
  requirements: [
    {
      binder: Binder.AND,
      title: "Lower Division Courses",
      requirements: [
        {
          departmentCode: "CSE",
          number: "12",
        },
        {
          departmentCode: "CSE",
          number: "16",
        },
        {
          departmentCode: "CSE",
          number: "20",
        },
        {
          departmentCode: "CSE",
          number: "30",
        },
        {
          departmentCode: "CSE",
          number: "13S",
        },
      ],
    },
    {
      binder: Binder.OR,
      title: "Mathematics",
      requirements: [
        {
          binder: Binder.AND,
          requirements: [
            {
              departmentCode: "MATH",
              number: "19A",
            },
            {
              departmentCode: "MATH",
              number: "19B",
            },
          ],
        },
        {
          binder: Binder.AND,
          requirements: [
            {
              departmentCode: "MATH",
              number: "20A",
            },
            {
              departmentCode: "MATH",
              number: "20B",
            },
          ],
        },
      ],
    },
    {
      binder: Binder.AND,
      title: "Applied Mathematics",
      requirements: [
        {
          binder: Binder.OR,
          requirements: [
            {
              departmentCode: "AM",
              number: "10",
            },
            {
              departmentCode: "MATH",
              number: "21",
            },
          ],
        },
        {
          binder: Binder.OR,
          requirements: [
            {
              departmentCode: "AM",
              number: "30",
            },
            {
              departmentCode: "MATH",
              number: "23A",
            },
          ],
        },
      ],
    },
    {
      binder: Binder.AND,
      title: "Engineering Science",
      requirements: [
        {
          departmentCode: "ECE",
          number: "30",
        },
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
