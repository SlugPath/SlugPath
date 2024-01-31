import { Option, Select, Typography } from "@mui/joy";
import { SyntheticEvent } from "react";

export interface SelectMajorNameProps {
  major: string;
  majors: string[];
  onChange: (
    event: SyntheticEvent<Element, Event> | null,
    newValue: string | null,
  ) => void;
}

export default function SelectMajorName({
  major,
  majors,
  onChange,
}: SelectMajorNameProps) {
  return (
    <>
      <Typography level="body-lg">Select your major</Typography>
      <Select
        value={major}
        placeholder="Choose one…"
        variant="soft"
        onChange={onChange}
        disabled={majors.length == 0}
      >
        {majors.map((major, index) => (
          <Option key={index} value={major}>
            {major}
          </Option>
        ))}
      </Select>
    </>
  );
}
