import { Program } from "@/app/types/Program";
import { Option, Select, Typography } from "@mui/joy";
import { SyntheticEvent } from "react";

export interface SelectMajorNameProps {
  selectedMajor: string;
  majors: Program[] | undefined;
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
        value={selectedMajor == "" ? null : selectedMajor}
        placeholder="Choose one…"
        variant="plain"
        onChange={onChange}
        disabled={majors === undefined || majors?.length == 0}
      >
        {majors?.map((major) => (
          <Option key={major.name} value={major.name}>
            {major.name}
          </Option>
        ))}
      </Select>
    </>
  );
}
