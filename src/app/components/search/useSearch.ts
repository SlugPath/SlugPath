import { geOptions } from "@/lib/consts";
import { searchParamsSchema, storedCoursesSchema } from "@customTypes/Course";
import useDebounce from "@hooks/useDebounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useSearch() {
  // Query to get the list of departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/departments");
        const departments = await searchParamsSchema.parse(await res.json());
        return [{ label: "--", value: null }, ...departments];
      } catch (e) {
        console.error(e);
      }
    },
  });

  // Query details for course search
  const [departmentCode, setDepartmentCode] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [ge, setGE] = useState<string | null>(null);
  const [queryDetails, setQueryDetails] = useState({
    departmentCode: "",
    number: "",
    ge: "",
  });

  // Query to get the courses based on the query details
  const { data: courses, isLoading: loading } = useQuery({
    queryKey: ["courses", queryDetails],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const res = await fetch("/api/courses", {
          method: "POST",
          body: JSON.stringify(queryDetails),
        });
        return await storedCoursesSchema.parse(await res.json());
      } catch (e) {
        console.error(e);
      }
    },
  });

  useDebounce({
    callback: () => handleSearch(departmentCode ?? "", number, ge ?? ""),
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
  ) => {
    const [departmentCodeParsed, numberParsed] = getDeptCodeAndCourseNum(
      textInput,
      departmentCode,
    );
    setQueryDetails({
      departmentCode: departmentCodeParsed,
      number: numberParsed,
      ge: geInput,
    });
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
    },
    handlers: {
      handleChangeDepartment,
      handleChangeNumber,
      handleChangeGE,
      handleSearch,
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
