import { geOptions } from "@/lib/consts";
import { coursesBy, getAllDepartments } from "@actions/course";
import { SearchQueryDetails } from "@customTypes/Course";
import useDebounce from "@hooks/useDebounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useSearch() {
  // Query to get the list of departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => [
      { label: "--", value: null },
      ...(await getAllDepartments()),
    ],
  });

  // Query details for course search
  const [departmentCode, setDepartmentCode] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [ge, setGE] = useState<string | null>(null);
  const [numberRange, setNumberRange] = useState<number[]>([1, 299]);
  const [creditRange, setCreditRange] = useState<number[]>([1, 15]);
  const [queryDetails, setQueryDetails] = useState<SearchQueryDetails>({
    departmentCode: "",
    number: "",
    ge: "",
    numberRange: [0, 299],
    creditRange: [1, 15],
  });

  // Query to get the courses based on the query details
  const { data: courses, isLoading: loading } = useQuery({
    queryKey: ["courses", queryDetails],
    placeholderData: keepPreviousData,
    queryFn: async () => await coursesBy(queryDetails),
  });

  useDebounce({
    callback: () =>
      handleSearch(
        departmentCode ?? "",
        number,
        ge ?? "",
        numberRange,
        creditRange,
      ),
    delay: 100,
    dependencies: [departmentCode, number, ge, ...numberRange, ...creditRange],
  });

  // Handlers
  const handleChangeDepartment = (
    _: React.SyntheticEvent | null,
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
    sliderNumberInput: number[],
    sliderCreditInput: number[],
  ) => {
    const [departmentCodeParsed, numberParsed] = getDeptCodeAndCourseNum(
      textInput,
      departmentCode,
    );
    setQueryDetails({
      departmentCode: departmentCodeParsed,
      number: numberParsed,
      ge: geInput,
      numberRange: sliderNumberInput,
      creditRange: sliderCreditInput,
    });
  };

  const handleChangeNumberRange = (newRange: number[]) => {
    setNumberRange(newRange);
  };

  const handleChangeCreditRange = (newRange: number[]) => {
    setCreditRange(newRange);
  };

  const handleReset = () => {
    setDepartmentCode("");
    setNumber("");
    setGE("");
    setNumberRange([0, 299]);
    setCreditRange([1, 15]);
    handleSearch(
      departmentCode ?? "",
      number,
      ge ?? "",
      numberRange,
      creditRange,
    );
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
      creditRange,
    },
    handlers: {
      handleChangeDepartment,
      handleChangeNumber,
      handleChangeGE,
      handleSearch,
      handleChangeNumberRange,
      handleChangeCreditRange,
      handleReset,
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
