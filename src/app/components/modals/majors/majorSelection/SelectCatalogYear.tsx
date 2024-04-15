import { Option, Select, Typography } from "@mui/joy";
import { SyntheticEvent } from "react";

export interface SelectCatalogYearProps {
  catalogYear: string;
  years: string[];
  onChange: (
    event: SyntheticEvent<Element, Event> | null,
    newValue: string | null,
  ) => void;
}

export default function SelectCatalogYear({
  catalogYear,
  years,
  onChange,
}: SelectCatalogYearProps) {
  return (
    <>
      <Typography level="body-lg">Catalog Year</Typography>
      <Select
        value={catalogYear}
        placeholder="Choose one…"
        variant="plain"
        onChange={onChange}
      >
        {years.map((year, index) => (
          <Option key={index} value={year}>
            {year}
          </Option>
        ))}
      </Select>
    </>
  );
}
