import { Chip } from "@mui/joy";
import { Label } from "../types/Label";
import { getColor } from "@/lib/labels";

export default function CourseLabel({
  label,
  displayText,
  children,
  inMenu = false,
}: {
  label: Label;
  displayText?: boolean;
  children?: React.ReactNode;
  inMenu?: boolean;
}) {
  const displayTextDefault = displayText === undefined ? true : displayText;

  return (
    <Chip
      style={getColor(label.color)}
      className={inMenu ? "px-4" : "px-2 mx-1"}
    >
      {displayTextDefault && <div>{label.name}</div>}
      {children}
    </Chip>
  );
}
