import { Label } from "../types/Label";
import { Chip } from "@mui/joy";
import { getColor } from "@/lib/labels";

export default function CourseLabel({
  label,
  children,
}: {
  label: Label;
  children?: React.ReactNode;
}) {
  return (
    <Chip
      className={getColor(label.color) + " min-w-[5rem]"}
      size="md"
      sx={{
        "--Chip-radius": "6px",
      }}
    >
      {label.name}
      {label.color}
      {children}
    </Chip>
  );
}
