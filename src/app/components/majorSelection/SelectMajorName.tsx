import { Option, Select, Typography } from "@mui/joy";
import { SyntheticEvent } from "react";

export interface SelectMajorNameProps {
  selectedMajor: string;
  majors: string[] | undefined;
  onChange: (
    event: SyntheticEvent<Element, Event> | null,
    newValue: string | null,
  ) => void;
}

export default function SelectMajorName({
  selectedMajor,
  majors,
  onChange,
}: SelectMajorNameProps) {
  return (
    <>
      <Typography level="body-lg">Name</Typography>
      <Select
        value={selectedMajor}
        placeholder="Choose one…"
        variant="plain"
        onChange={onChange}
        disabled={majors?.length == 0}
      >
        {majors?.map((major, index) => (
          <Option key={index} value={major}>
            {major}
          </Option>
        ))}
      </Select>
    </>
  );
}
