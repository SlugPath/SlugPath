import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import useDebounce from "./useDebounce";
import { StoredCourse } from "../types/Course";
import { GET_COURSES, GET_DEPARTMENTS } from "@/graphql/queries";

export default function useSearch({
  coursesInPlanner,
}: {
  coursesInPlanner: string[];
}) {
  // Get all the departments
  const [departments, setDepartments] = useState<
    { label: string; value: string }[]
  >([]);
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

  // Query details for course search
  const [departmentCode, setDepartmentCode] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [queryDetails, setQueryDetails] = useState({
    departmentCode: "",
    number: "",
  });
  const { data, loading } = useQuery(GET_COURSES, {
    variables: {
      departmentCode: queryDetails.departmentCode,
      number: nullIfNumberEmpty(queryDetails.number),
    },
  });

  useDebounce({
    callback: () => handleSearch(departmentCode ?? "", number),
    delay: 500,
    dependencies: [departmentCode, number],
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

  const handleSearch = (departmentCode: string, numberInput: string) => {
    setQueryDetails({
      departmentCode,
      number: numberInput.toUpperCase(),
    });
  };

  function courseIsAlreadyAdded(course: StoredCourse) {
    let alreadyAdded = false;
    coursesInPlanner.forEach((c) => {
      const [departmentCode, number] = c.split("-");
      if (
        departmentCode === course.departmentCode &&
        number === course.number
      ) {
        alreadyAdded = true;
      }
    });
    return alreadyAdded;
  }

  function nullIfNumberEmpty(number: string): string | null {
    return number.length > 0 ? number : null;
  }

  return {
    data,
    loading,
    departments,
    departmentCode,
    number,
    handleChangeDepartment,
    handleChangeNumber,
    handleSearch,
    courseIsAlreadyAdded,
  };
}
