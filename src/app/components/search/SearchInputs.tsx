import { SearchParams } from "@customTypes/Course";
import { InfoOutlined } from "@mui/icons-material";
import { Input, Option, Select, Typography } from "@mui/joy";
import React from "react";

type selectChangeHandler = (
  event: React.SyntheticEvent | null,
  value: string | null,
) => void;

export interface SearchInputsProps {
  error: boolean;
  params: {
    departmentCode: string | null;
    departments: SearchParams;
    number: string;
    ge: string | null;
    geOptions: SearchParams;
  };
  handlers: {
    handleSearch: (department: string, number: string, ge: string) => void;
    handleChangeNumber: (number: string) => void;
    handleChangeGE: selectChangeHandler;
    handleChangeDepartment: selectChangeHandler;
  };
}

export default function SearchInputs({
  error,
  params,
  handlers,
}: SearchInputsProps) {
  const { departmentCode, number, ge, departments, geOptions } = params;
  const {
    handleSearch,
    handleChangeDepartment,
    handleChangeGE,
    handleChangeNumber,
  } = handlers;

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
