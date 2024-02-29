import { Card } from "@mui/joy";

import CustomCourseSelection from "./CustomCourseSelection";
import SearchInputs from "./SearchInputs";
import SearchResults from "./SearchResults";
import useSearch from "./useSearch";

/**
 * Component for searching for courses to add.
 */
export default function Search({
  displayCustomCourseSelection = false,
}: {
  displayCustomCourseSelection?: boolean;
}) {
  const { courses, handlers, params, loading } = useSearch();

  return (
    <>
      {displayCustomCourseSelection && <CustomCourseSelection />}
      <Card className="flex flex-col w-80 h-full min-h-0" variant="plain">
        <SearchInputs handlers={handlers} params={params} />
        <SearchResults courses={courses} loading={loading} />
      </Card>
    </>
  );
}
