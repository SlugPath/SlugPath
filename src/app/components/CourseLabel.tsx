import { Label } from "../types/Label";
import { getColor } from "@/lib/labels";

export default function CourseLabel({
  label,
  displayText,
  children,
}: {
  label: Label;
  displayText?: boolean;
  children?: React.ReactNode;
}) {
  const displayTextDefault = displayText === undefined ? true : displayText;

  if (displayTextDefault) {
    return (
      <div style={getColor(label.color)} className={"rounded-lg px-1 mx-1"}>
        <div>{label.name}</div>
        {children}
      </div>
    );
  }

  return (
    <div
      style={getColor(label.color)}
      className={"rounded-md px-1 px-2 py-2 mx-1"}
    >
      {children}
    </div>
  );
}
