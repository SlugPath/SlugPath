import { Input, Option, Select, Typography } from "@mui/joy";
import useSearch from "../../hooks/useSearch";
import { InfoOutlined } from "@mui/icons-material";
import { useEffect } from "react";

export default function SearchInputs({
  onUpdateCourses,
  onUpdateLoading,
  onUpdateLoadingUseQuery,
}: {
  onUpdateCourses: any;
  onUpdateLoading: any;
  onUpdateLoadingUseQuery: any;
}) {
  const {
    courses,
    loading,
    loadingUseQuery,
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
    onUpdateLoadingUseQuery(loadingUseQuery);
  }, [loadingUseQuery, onUpdateLoadingUseQuery]);

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
          size="md"
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
          size="md"
        />
        <Select
          placeholder="GE"
          name="ge"
          aria-label="ge"
          className="col-span-2"
          variant="soft"
          onChange={handleChangeGE}
          value={ge ?? ""}
          size="md"
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
