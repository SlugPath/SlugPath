import { StoredCourse } from "@/app/types/Course";
import { Card } from "@mui/joy";
import { useState } from "react";

import CustomCourseSelection from "./CustomCourseSelection";
import SearchInputs from "./SearchInputs";
import SearchResults from "./SearchResults";

/**
 * Component for searching for courses to add.
 */
export default function Search({
  displayCustomCourseSelection,
  searchComponentId,
}: {
  displayCustomCourseSelection: boolean;
  searchComponentId: string;
}) {
  const [courses, setCourses] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMoreResults, setLoadingMoreResults] = useState<boolean>(false);

  return (
    <>
      {displayCustomCourseSelection && <CustomCourseSelection />}
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
          searchComponentId={searchComponentId}
        />
      </Card>
    </>
  );
}
