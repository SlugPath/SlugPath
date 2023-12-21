import { Typography, Select, Option } from "@mui/joy";
import { SyntheticEvent } from "react";

export default function SelectCatalogYear({
  catalogYear,
  years,
  onChange,
}: {
  catalogYear: string;
  years: string[];
  onChange: (
    event: SyntheticEvent<Element, Event> | null,
    newValue: string | null,
  ) => void;
}) {
  return (
    <>
      <Typography level="body-lg">Select your catalog year</Typography>
      <Select
        value={catalogYear}
        placeholder="Choose one…"
        variant="soft"
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
