import { Card, CssVarsProvider } from "@mui/joy";
import { useState } from "react";
import CustomCourseSelection from "./CustomCourseSelection";
import SearchInputs from "./SearchInputs";
import SearchResults from "./SearchResults";

/**
 * Component for searching for courses to add. `coursesAlreadyAdded` is a list of courses that have
 * already been added to the planner
 */
export default function Search() {
  const [courses, setCourses] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUseQuery, setLoadingUseQuery] = useState<boolean>(false);

  return (
    <CssVarsProvider defaultMode="system">
      <CustomCourseSelection />
      <Card className="w-80" variant="plain">
        <SearchInputs
          onUpdateCourses={setCourses}
          onUpdateLoading={setLoading}
          onUpdateLoadingUseQuery={setLoadingUseQuery}
        />
        <SearchResults
          courses={courses}
          loading={loading}
          loadingUseQuery={loadingUseQuery}
        />
      </Card>
    </CssVarsProvider>
  );
}
