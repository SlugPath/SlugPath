import { useState, useEffect } from "react";
import { useBackgroundQuery, useQuery, useReadQuery } from "@apollo/client";
import useDebounce from "./useDebounce";
import { StoredCourse } from "../types/Course";
import { GET_COURSES, GET_DEPARTMENTS } from "@/graphql/queries";

const initialData = { coursesBy: [] };

export default function useSearch({
  coursesInPlanner,
}: {
  coursesInPlanner: string[];
}) {
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<
    { label: string; value: string }[]
  >([]);

  // Query details for course search
  const [departmentCode, setDepartmentCode] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [cacheQueryDetails, setCacheQueryDetails] = useState({
    departmentCode: "",
    number: "",
  });
  const [queryDetails, setQueryDetails] = useState({
    departmentCode: "",
    number: "",
  });

  // useBackgroundQuery gives the queryRef to use in useReadQuery to instantly search the cache
  const [queryRef] = useBackgroundQuery(GET_COURSES, {
    variables: {
      departmentCode: cacheQueryDetails.departmentCode,
      number: nullIfNumberEmpty(cacheQueryDetails.number),
    },
  });
  const { data: useReadQueryData } = useReadQuery(queryRef);
  const { data: useQueryData, loading: loadingUseQuery } = useQuery(
    GET_COURSES,
    {
      variables: {
        departmentCode: queryDetails.departmentCode,
        number: nullIfNumberEmpty(queryDetails.number),
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

  // debounce for running queries on cache
  useDebounce({
    callback: () => handleSearch(departmentCode ?? "", number, false),
    delay: 0,
    dependencies: [departmentCode, number],
  });

  // debounce for running queries on backend database
  useDebounce({
    callback: () => handleSearch(departmentCode ?? "", number, true),
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

  const handleSearch = (
    departmentCode: string,
    numberInput: string,
    runCacheQuery: boolean,
  ) => {
    if (runCacheQuery) {
      setQueryDetails({
        departmentCode,
        number: numberInput.toUpperCase(),
      });
    } else {
      setCacheQueryDetails({
        departmentCode,
        number: numberInput.toUpperCase(),
      });
    }
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
    loadingUseQuery,
    departments,
    departmentCode,
    number,
    handleChangeDepartment,
    handleChangeNumber,
    handleSearch,
    courseIsAlreadyAdded,
  };
}
