import { useState, useEffect } from "react";
import { useBackgroundQuery, useQuery, useReadQuery } from "@apollo/client";
import useDebounce from "./useDebounce";
import { GET_COURSES, GET_DEPARTMENTS } from "@/graphql/queries";

const initialData = { coursesBy: [] };
const geOptions = [
  { label: "--", value: null },
  { label: "C", value: "c" },
  { label: "CC", value: "cc" },
  { label: "ER", value: "er" },
  { label: "IM", value: "im" },
  { label: "MF", value: "mf" },
  { label: "SI", value: "si" },
  { label: "SR", value: "sr" },
  { label: "TA", value: "ta" },
  /* Include options for PE subcategories */
  { label: "PE-T", value: "peT" },
  { label: "PE-H", value: "peH" },
  { label: "PE-E", value: "peE" },
  /* Include options for PR subcategories */
  { label: "PR-C", value: "prC" },
  { label: "PR-E", value: "prE" },
  { label: "PR-S", value: "prS" },
];

export default function useSearch() {
  const [data, setData] = useState<any>(initialData);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<
    { label: string; value: string }[]
  >([]);

  // Query details for course search
  const [departmentCode, setDepartmentCode] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [ge, setGE] = useState<string | null>(null);
  const [queryDetails, setQueryDetails] = useState({
    departmentCode: "",
    number: "",
    ge: "",
  });

  // useBackgroundQuery gives the queryRef to use in useReadQuery
  const [queryRef] = useBackgroundQuery(GET_COURSES, {
    variables: {
      departmentCode: queryDetails.departmentCode,
      number: nullIfEmpty(queryDetails.number),
    },
  });
  const { data: useReadQueryData } = useReadQuery(queryRef);
  const { data: useQueryData, loading: loadingUseQuery } = useQuery(
    GET_COURSES,
    {
      variables: {
        departmentCode: queryDetails.departmentCode,
        number: nullIfEmpty(queryDetails.number),
        ge: nullIfEmpty(queryDetails.ge),
      },
    },
  );
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS);

  useEffect(() => {
    if (!departmentsData || !departmentsData.departments) return;
    // Sort departments data
    const sortedDepartments = departmentsData.departments
      .map((dep: { name: string; code: string }) => ({
        label: dep.name,
        value: dep.code,
      }))
      .sort((a: { label: string }, b: { label: string }) =>
        a.label.localeCompare(b.label),
      );
    // Set departments data
    setDepartments([{ label: "--", value: null }, ...sortedDepartments]);
  }, [departmentsData]);

  useEffect(() => {
    setLoading(loadingUseQuery);
    if (useQueryData) {
      setData(useQueryData);
    } else if (useReadQueryData) {
      setData({ coursesBy: useReadQueryData });
    } else {
      setLoading(true);
    }
  }, [useReadQueryData, useQueryData, loadingUseQuery]);

  useDebounce({
    callback: () => handleSearch(departmentCode ?? "", number, ge ?? ""),
    delay: 0,
    dependencies: [departmentCode, number, ge],
  });

  const handleChangeDepartment = (
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    setDepartmentCode(newValue);
  };

  const handleChangeNumber = (number: string) => {
    setNumber(number.toString());
  };

  const handleChangeGE = (
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    setGE(newValue === "" ? null : newValue);
  };

  /**
   * try to parse department code and course number from the courseNumber string
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

  function getDepartmentCodeAndCourseNumber(
    courseNumber: string,
    departmentCode: string,
  ): [string, string] {
    const [parsedDepartmentCode, parsedCourseNumber] =
      parseCourseNumber(courseNumber);

    return [
      parsedDepartmentCode
        ? parsedDepartmentCode.toUpperCase()
        : departmentCode,
      parsedCourseNumber ? parsedCourseNumber.toUpperCase() : "",
    ];
  }

  function searchInputIsValid(searchInput: string): boolean {
    return searchInput === "" || /([a-z]+)?\s*(\d+[a-z]*)?/i.test(searchInput);
  }

  const handleSearch = (
    departmentCode: string,
    textInput: string,
    geInput: string,
  ) => {
    const inputIsValid = searchInputIsValid(textInput);
    setError(!inputIsValid);

    if (inputIsValid) {
      const [departmentCodeParsed, numberParsed] =
        getDepartmentCodeAndCourseNumber(textInput, departmentCode);
      setQueryDetails({
        departmentCode: departmentCodeParsed,
        number: numberParsed,
        ge: geInput,
      });
    }
  };

  function nullIfEmpty(input: string): string | null {
    return input.length > 0 ? input : null;
  }

  return {
    error,
    courses: data && data.coursesBy ? data.coursesBy : [],
    loading,
    loadingUseQuery,
    departments,
    departmentCode,
    number,
    ge,
    geOptions,
    handleChangeDepartment,
    handleChangeNumber,
    handleChangeGE,
    handleSearch,
  };
}
