import { StoredCourse } from "../ts-types/Course";
import { useState, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import { initialPlanner } from "../../lib/initialPlanner";
import { PlannerData } from "../ts-types/PlannerData";
import useHandleCourseDrag from "./useHandleCourseDrag";

export default function useCoursePlanner({ id }: { id: string }) {
  const [courseState, setCourseState] = useState(initialPlanner);
  const { handleDragEnd } = useHandleCourseDrag({
    courseState,
    handleCourseUpdate,
  });

  useEffect(() => {
    loadCourseStateFromCookies();
  }, [id]);

  function loadCourseStateFromCookies() {
    const cookieCourseState = getCookie("courseState");
    if (cookieCourseState) {
      setCourseState(JSON.parse(cookieCourseState) as PlannerData);
    }
  }

  function writeCourseStateToCookies() {
    const json = JSON.stringify({
      ...courseState,
    });
    setCookie("courseState", json);
  }

  function handleCourseUpdate(courseState: PlannerData) {
    setCourseState(courseState);
    writeCourseStateToCookies();
  }

  function coursesInPlanner() {
    const coursesAlreadyAdded: StoredCourse[] = [];
    Object.values(courseState.quarters).forEach((quarter) => {
      quarter.courses.forEach((course) => {
        coursesAlreadyAdded.push(course);
      });
    });
    return coursesAlreadyAdded;
  }

  return {
    courseState,
    handleDragEnd,
    coursesInPlanner,
  };
}
