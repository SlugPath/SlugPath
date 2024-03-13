import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Card, Tooltip, Typography } from "@mui/joy";

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
      <Card className=" flex-col w-80 h-full min-h-0 min-w-80" variant="plain">
        <div className="flex flex-col place-items-center">
          <Typography level="title-lg" className="flex items-center gap-2">
            Course Search
            <Tooltip
              title="Search by class name, or filter by department or GE type"
              variant="soft"
            >
              <HelpOutlineIcon style={{ fontSize: "22px" }} />
            </Tooltip>
          </Typography>
        </div>
        <SearchInputs handlers={handlers} params={params} />
        <SearchResults courses={courses} loading={loading} />
      </Card>
      {displayCustomCourseSelection && <CustomCourseSelection />}
    </>
  );
}
