import { SearchParams } from "@customTypes/Course";
import {
  AccordionDetails,
  Button,
  Divider,
  Input,
  Option,
  Select,
  useColorScheme,
} from "@mui/joy";
import Accordion, { accordionClasses } from "@mui/joy/Accordion";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import { SyntheticEvent } from "react";

import CustomSliderComponent from "./CustomSliderComponent";

type selectChangeHandler = (
  event: SyntheticEvent | null,
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

  const { mode } = useColorScheme();

  const backgroundColor = mode === "light" ? "#f1f5f9" : "#181a1c";

  const courseNumberMarks = [
    { value: 1, label: "1" },
    { value: 100, label: "100" },
    { value: 200, label: "200" },
    { value: 299, label: "299" },
  ];

  const creditMarks = [
    { value: 1, label: "1" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
  ];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch(
          departmentCode ?? "",
          number,
          ge ?? "",
          numberRange,
          creditRange,
        );
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
        <Accordion
          className="col-span-6"
          sx={{
            padding: "0.5rem",
            textAlign: "center",
            backgroundColor,
            borderRadius: 8,
            [`& .${accordionSummaryClasses.root}`]: {
              "& button:hover": {
                background: "transparent",
              },
            },
            [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
              borderBottom: "1px solid",
              borderColor: "background.level2",
            },
            '& [aria-expanded="true"]': {
              paddingBottom: "0.5rem",
              boxShadow: (theme) =>
                `inset 0 -1px 0 ${theme.vars.palette.divider}`,
            },
          }}
          defaultExpanded={false}
        >
          <AccordionSummary>Advanced Search</AccordionSummary>
          <AccordionDetails sx={{ borderRadius: "sm" }}>
            <CustomSliderComponent
              onSliderChange={handleChangeNumberRange}
              sliderRange={numberRange}
              defaultRangeValue={[1, 299]}
              marks={courseNumberMarks}
              label={"Course Number Range"}
            />
            <Divider
              sx={{ height: 3, marginBottom: "0.5rem", marginTop: "0.5rem" }}
            />
            <CustomSliderComponent
              onSliderChange={handleChangeCreditRange}
              sliderRange={creditRange}
              defaultRangeValue={[1, 15]}
              marks={creditMarks}
              label={"Course Credit Range"}
            />
          </AccordionDetails>
        </Accordion>
        <Button className="col-span-6" variant="solid" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
      <Divider sx={{ height: 3, marginBottom: "0.25rem" }} />
    </form>
  );
}
