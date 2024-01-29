import { StoredCourse } from "@/app/types/Course";
import { Card } from "@mui/joy";
import { useState } from "react";

import CustomCourseSelection from "./CustomCourseSelection";
import SearchInputs from "./SearchInputs";
import SearchResults from "./SearchResults";

/**
 * Component for searching for courses to add.
 */
export default function Search() {
  const [courses, setCourses] = useState<StoredCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMoreResults, setLoadingMoreResults] = useState<boolean>(false);

  return (
    <>
      <CustomCourseSelection />
      <Card className="w-80" variant="plain">
        <SearchInputs
          onUpdateCourses={(courses: StoredCourse[]) => setCourses(courses)}
          onUpdateLoading={(loading: boolean) => setLoading(loading)}
          onUpdateLoadingMoreResults={(loading: boolean) =>
            setLoadingMoreResults(loading)
          }
        />
        <SearchResults
          courses={courses}
          loading={loading}
          loadingUseQuery={loadingMoreResults}
        />
      </Card>
    </>
  );
}
