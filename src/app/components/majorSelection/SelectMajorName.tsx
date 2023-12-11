import { Typography, Select, Option } from "@mui/joy";

export default function SelectMajorName({
  major,
  majors,
  onChange,
}: {
  major: string;
  majors: string[];
  onChange: any;
}) {
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
