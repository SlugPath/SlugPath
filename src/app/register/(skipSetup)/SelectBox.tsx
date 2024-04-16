import { cn } from "@/lib/utils";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

interface SelectBoxProps {
  selected: boolean;
  setSelected: () => void;
  children: React.ReactNode;
}

const defaultSelectCheckButton = {
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  height: "1.25rem",
};

export default function SelectBox({
  selected,
  setSelected,
  children,
}: SelectBoxProps) {
  return (
    <div
      className={cn(
        selected ? "border-primary-500" : "border-gray-300",
        "relative flex items-center justify-between w-full border-2 rounded-lg p-3 shadow min-h-10",
      )}
      onClick={setSelected}
    >
      {selected ? (
        <CheckCircle
          sx={{ ...defaultSelectCheckButton, color: "rgb(59 130 246 / 1)" }}
        />
      ) : (
        <RadioButtonUnchecked
          sx={{ ...defaultSelectCheckButton, color: "rgb(209 213 219 / 1)" }}
        />
      )}
      {children}
    </div>
  );
}
