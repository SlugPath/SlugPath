import { Option, Select, Typography } from "@mui/joy";
import { SyntheticEvent } from "react";

export interface SelectCatalogYearProps {
  catalogYear: string;
  years: { catalogYear: string }[];
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
        {years.map((year) => (
          <Option key={year.catalogYear} value={year.catalogYear}>
            {year.catalogYear}
          </Option>
        ))}
      </Select>
    </>
  );
}
