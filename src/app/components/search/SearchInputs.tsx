import { SearchParams } from "@customTypes/Course";
import { Button, Divider, Input, Option, Select } from "@mui/joy";
import React from "react";
import { useCallback, useEffect } from "react";

import CourseCreditSlider from "./CourseCreditSlider";
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
    creditRange: number[];
  };
  handlers: {
    handleSearch: (
      department: string,
      number: string,
      ge: string,
      numberRange: number[],
      creditRange: number[],
    ) => void;
    handleChangeNumber: (number: string) => void;
    handleChangeGE: selectChangeHandler;
    handleChangeDepartment: selectChangeHandler;
    handleChangeNumberRange: (numberRange: number[]) => void;
    handleChangeCreditRange: (numberRange: number[]) => void;
    handleReset: () => void;
  };
}

export default function SearchInputs({ params, handlers }: SearchInputsProps) {
  const {
    departmentCode,
    number,
    ge,
    departments,
    geOptions,
    numberRange,
    creditRange,
  } = params;
  const {
    handleSearch,
    handleChangeDepartment,
    handleChangeGE,
    handleChangeNumber,
    handleChangeNumberRange,
    handleChangeCreditRange,
    handleReset,
  } = handlers;

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSearch(
        departmentCode ?? "",
        number,
        ge ?? "",
        numberRange,
        creditRange,
      );
    },
    [handleSearch, departmentCode, number, ge, numberRange, creditRange],
  );

  useEffect(() => {
    const syntheticEvent = new Event(
      "submit",
    ) as unknown as React.FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  }, [handleSubmit, numberRange, creditRange]);

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
          value={number}
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
        <CourseCreditSlider onSliderChange={handleChangeCreditRange} />
        <Button className="col-span-6" variant="solid" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
      <Divider sx={{ height: 3, marginBottom: "0.25rem" }} />
    </form>
  );
}
