import { cn } from "@/lib/utils";
import { CircularProgress } from "@mui/joy";
import React from "react";

interface ContinueButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function ContinueButton({
  loading,
  disabled,
  onClick,
  children,
}: ContinueButtonProps) {
  return (
    <button
      className={cn(
        disabled && "cursor-not-allowed opacity-50",
        "bg-primary-500 text-white w-full flex items-center justify-center py-3 rounded-lg transition-opacity font-bold flex-row",
      )}
      aria-disabled={disabled}
      onClick={onClick}
    >
      {loading ? <CircularProgress size="sm" /> : children}
    </button>
  );
}
