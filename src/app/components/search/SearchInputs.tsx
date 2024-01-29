import { StoredCourse } from "@/app/types/Course";
import { InfoOutlined } from "@mui/icons-material";
import { Input, Option, Select, Typography } from "@mui/joy";
import { useEffect } from "react";

import useSearch from "./useSearch";

export interface SearchInputsProps {
  onUpdateCourses: (courses: StoredCourse[]) => void;
  onUpdateLoading: (loading: boolean) => void;
  onUpdateLoadingMoreResults: (loading: boolean) => void;
}

export default function SearchInputs({
  onUpdateCourses,
  onUpdateLoading,
  onUpdateLoadingMoreResults,
}: SearchInputsProps) {
  const {
    courses,
    loading,
    loadingMoreResults,
    departments,
    handleChangeDepartment,
    handleChangeNumber,
    handleChangeGE,
    handleSearch,
    departmentCode,
    number,
    ge,
    error,
    geOptions,
  } = useSearch();

  useEffect(() => {
    onUpdateCourses(courses);
  }, [courses, onUpdateCourses]);

  useEffect(() => {
    onUpdateLoading(loading);
  }, [loading, onUpdateLoading]);

  useEffect(() => {
    onUpdateLoadingMoreResults(loadingMoreResults);
  }, [loadingMoreResults, onUpdateLoadingMoreResults]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch(departmentCode ?? "", number, ge ?? "");
      }}
    >
      <div className="grid grid-cols-6 gap-2 p-2">
        <Select
          placeholder="Department"
          name="department"
          aria-label="department"
          className="col-span-6"
          variant="soft"
          onChange={handleChangeDepartment}
          value={departmentCode ?? ""}
          slotProps={{
            listbox: {
              sx: { minWidth: 270 },
            },
          }}
        >
          {departments.map((dep) => (
            <Option key={dep.value} value={dep.value}>
              {dep.label}
            </Option>
          ))}
        </Select>
        <Input
          error={error}
          className="w-full col-span-4"
          color="neutral"
          placeholder="Number"
          variant="soft"
          name="number"
          aria-label="number"
          onChange={(event) => handleChangeNumber(event.target.value)}
        />
        <Select
          placeholder="GE"
          name="ge"
          aria-label="ge"
          className="col-span-2"
          variant="soft"
          onChange={handleChangeGE}
          value={ge ?? ""}
        >
          {geOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        {error && (
          <Typography className="col-span-4" color="danger">
            <InfoOutlined />
            Invalid course number
          </Typography>
        )}
      </div>
    </form>
  );
}
