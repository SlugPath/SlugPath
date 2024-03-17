import useSearch from "@/app/hooks/useSearch";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Card, CircularProgress, Tooltip } from "@mui/joy";

import CustomCourseSelection from "./CustomCourseSelection";
import SearchInputs from "./SearchInputs";
import SearchResults from "./SearchResults";

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
      <Card className=" flex-col w-80 h-full min-h-0 min-w-80" variant="plain">
        <div className="flex flex-col place-items-center">
          <div className="flex text-xl font-bold items-center gap-2">
            Course Search
            <Tooltip
              title="Search by class name, or filter by department or GE type"
              variant="soft"
            >
              <HelpOutlineIcon style={{ fontSize: "22px" }} />
            </Tooltip>
          </div>
        </div>
        <SearchInputs handlers={handlers} params={params} />
        <div className="flex flex-col place-items-center">
          {loading ? <CircularProgress /> : null}
        </div>
        <SearchResults courses={courses} loading={loading} />
      </Card>
      {displayCustomCourseSelection && <CustomCourseSelection />}
    </>
  );
}
