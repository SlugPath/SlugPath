import { GET_COURSES } from "@/graphql/queries";
import { useBackgroundQuery, useReadQuery, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";

const initialData = { coursesBy: [] };

/**
 * Queries courses by @param departmentCode and number,
 * however it first queries the cache and then the backend database
 * to provide a faster search experience.
 */
export default function useOptimizedSearch({
  departmentCode,
  number,
}: {
  departmentCode: string | null;
  number: string;
}) {
  const [data, setData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  // Query details for course search
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

  useEffect(() => {
    setLoading(loadingUseQuery);
    if (useReadQueryData) {
      setData({ coursesBy: useReadQueryData });
    } else if (useQueryData) {
      setData(useQueryData);
    } else {
      setLoading(true);
    }
  }, [useReadQueryData, useQueryData, loadingUseQuery]);

  // debounce for running queries on cache
  useDebounce({
    callback: () => handleSearch(departmentCode ?? "", number, true),
    delay: 0,
    dependencies: [departmentCode, number],
  });

  // debounce for running queries on backend database
  useDebounce({
    callback: () => handleSearch(departmentCode ?? "", number, false),
    delay: 500,
    dependencies: [departmentCode, number],
  });

  const handleSearch = (
    departmentCode: string,
    numberInput: string,
    runCacheQuery: boolean,
  ) => {
    if (runCacheQuery) {
      setCacheQueryDetails({
        departmentCode,
        number: numberInput.toUpperCase(),
      });
    } else {
      setQueryDetails({
        departmentCode,
        number: numberInput.toUpperCase(),
      });
    }
  };

  useEffect(() => {
    handleSearch(departmentCode ?? "", number, true);
  }, [departmentCode, number]);

  function nullIfNumberEmpty(number: string): string | null {
    return number.length > 0 ? number : null;
  }

  return {
    handleSearch,
    loadingUseQuery,
    loading,
    data,
  };
}
