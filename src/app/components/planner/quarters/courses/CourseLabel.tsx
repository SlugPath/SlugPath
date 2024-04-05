import { lookupColor } from "@/lib/labels";
import { Label } from "@customTypes/Label";
import { Chip } from "@mui/joy";

export interface CourseLabelProps {
  label: Label;
  displayText?: boolean;
  children?: React.ReactNode;
  inMenu?: boolean;
}

export default function CourseLabel({
  label,
  displayText,
  children,
  inMenu = false,
}: CourseLabelProps) {
  const displayTextDefault = displayText === undefined ? true : displayText;

  return (
    <Chip
      style={lookupColor(label.color ?? "grey")}
      sx={{
        paddingX: inMenu ? "1rem" : "0.5rem",
        marginX: "0.25rem",
      }}
    >
      {displayTextDefault && <div>{label.name}</div>}
      {children}
    </Chip>
  );
}
