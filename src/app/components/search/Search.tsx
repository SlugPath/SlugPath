import { Card } from "@mui/joy";

import CustomCourseSelection from "./CustomCourseSelection";
import SearchInputs from "./SearchInputs";
import SearchResults from "./SearchResults";
import useSearch from "./useSearch";

/**
 * Component for searching for courses to add.
 */
export default function Search() {
  const { courses, handlers, params, loading } = useSearch();

  return (
    <>
      <CustomCourseSelection />
      <Card className="w-80" variant="plain">
        <SearchInputs handlers={handlers} params={params} />
        <SearchResults courses={courses} loading={loading} />
      </Card>
    </>
  );
}
