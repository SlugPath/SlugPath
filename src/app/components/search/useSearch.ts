import { geOptions } from "@/lib/consts";
import { coursesBy, getAllDepartments } from "@actions/course";
import useDebounce from "@hooks/useDebounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

/* Need to update the search to accomadate the number range.
Cases1: If nummber input is not empty and number range is set to the default min and max values use the number input value
Case2: If number input is empty and number range is not default values use number range
Case3: If number input is empty and number range is set to default use deafault  */

export default function useSearch() {
  // Query to get the list of departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      try {
        const depts = await getAllDepartments();
        return [{ label: "--", value: null }, ...depts];
      } catch (e) {
        console.error(e);
      }
    },
  });

  // Query details for course search
  const [departmentCode, setDepartmentCode] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [ge, setGE] = useState<string | null>(null);
  const [numberRange, setNumberRange] = useState<number[]>([0, 299]);
  const [queryDetails, setQueryDetails] = useState({
    departmentCode: "",
    number: "",
    ge: "",
    numberRange: [0, 299],
  });

  // Query to get the courses based on the query details
  const { data: courses, isLoading: loading } = useQuery({
    queryKey: ["courses", queryDetails],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const res = await coursesBy(queryDetails);
        return res;
      } catch (e) {
        console.error(e);
      }
    },
  });

  useDebounce({
    callback: () =>
      handleSearch(departmentCode ?? "", number, ge ?? "", numberRange),
    delay: 100,
    dependencies: [departmentCode, number, ge],
  });

  // Handlers
  const handleChangeDepartment = (
    event: React.SyntheticEvent | null,
    value: string | null,
  ) => {
    setDepartmentCode(value);
  };

  const handleChangeNumber = (number: string) => {
    setNumber(number.toString());
  };

  const handleChangeGE = (
    event: React.SyntheticEvent | null,
    value: string | null,
  ) => {
    setGE(value === "" ? null : value);
  };

  const handleSearch = (
    departmentCode: string,
    textInput: string,
    geInput: string,
    sliderInput: number[],
  ) => {
    const [departmentCodeParsed, numberParsed] = getDeptCodeAndCourseNum(
      textInput,
      departmentCode,
    );
    console.log("handleSearch: ", sliderInput);
    setQueryDetails({
      departmentCode: departmentCodeParsed,
      number: numberParsed,
      ge: geInput,
      numberRange: sliderInput,
    });
  };

  const handleChangeNumberRange = (newRange: number[]) => {
    console.log("handleChangeNumberRange: ", newRange);
    setNumberRange(newRange);
  };

  return {
    courses: courses ?? [],
    loading,
    params: {
      departments: departments ?? [],
      departmentCode,
      number,
      ge,
      geOptions,
      numberRange,
    },
    handlers: {
      handleChangeDepartment,
      handleChangeNumber,
      handleChangeGE,
      handleSearch,
      handleChangeNumberRange,
    },
  };
}

/**
 * Try to parse department code and course number from the courseNumber string
 */
function parseCourseNumber(
  courseNumber: string,
): [string | null, string | null] {
  const pattern = /([a-z]+)?\s*(\d+[a-z]*)?/i;
  const match = courseNumber.match(pattern);

  if (match) {
    const departmentCode = match[1] || null;
    const courseNumber = match[2] || null;
    return [departmentCode, courseNumber];
  } else {
    return [null, null];
  }
}

function getDeptCodeAndCourseNum(
  courseNumber: string,
  departmentCode: string,
): [string, string] {
  const [parsedDepartmentCode, parsedCourseNumber] =
    parseCourseNumber(courseNumber);

  return [
    parsedDepartmentCode ? parsedDepartmentCode.toUpperCase() : departmentCode,
    parsedCourseNumber ? parsedCourseNumber.toUpperCase() : "",
  ];
}
