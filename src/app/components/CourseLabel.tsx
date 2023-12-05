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
      className={
        inMenu ? "rounded-md px-6 py-2 mx-1 " : "rounded-md px-2 py-2 mx-1"
      }
    >
      {children}
    </div>
  );
}
