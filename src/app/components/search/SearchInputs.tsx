import { SearchParams } from "@customTypes/Course";
import { Divider, Input, Option, Select } from "@mui/joy";
import React from "react";
import { useEffect } from "react";

import CourseNumberSlider from "./CourseNumberSlider";

type selectChangeHandler = (
  event: React.SyntheticEvent | null,
  value: string | null,
) => void;

export interface SearchInputsProps {
  params: {
    departmentCode: string | null;
    departments: SearchParams;
    number: string;
    ge: string | null;
    geOptions: SearchParams;
    numberRange: number[];
  };
  handlers: {
    handleSearch: (
      department: string,
      number: string,
      ge: string,
      numberRange: number[],
    ) => void;
    handleChangeNumber: (number: string) => void;
    handleChangeGE: selectChangeHandler;
    handleChangeDepartment: selectChangeHandler;
    handleChangeNumberRange: (numberRange: number[]) => void;
  };
}

export default function SearchInputs({ params, handlers }: SearchInputsProps) {
  const { departmentCode, number, ge, departments, geOptions, numberRange } =
    params;
  const {
    handleSearch,
    handleChangeDepartment,
    handleChangeGE,
    handleChangeNumber,
    handleChangeNumberRange,
  } = handlers;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(departmentCode ?? "", number, ge ?? "", numberRange);
  };

  useEffect(() => {
    const syntheticEvent = new Event(
      "submit",
    ) as unknown as React.FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  }, [numberRange]);

  return (
    <form onSubmit={handleSubmit}>
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
        <CourseNumberSlider onSliderChange={handleChangeNumberRange} />
      </div>
      <Divider sx={{ height: 3, marginBottom: "0.75rem" }} />
    </form>
  );
}
