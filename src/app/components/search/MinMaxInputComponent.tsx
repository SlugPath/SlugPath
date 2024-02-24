// MinMaxInput.tsx
import { FormControl, FormHelperText, Input } from "@mui/joy";
import React from "react";

interface MinMaxInputProps {
  value: string;
  minValue: string;
  maxValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  label: string;
}

export default function MinMaxInput({
  value,
  minValue,
  maxValue,
  onChange,
  onEnter,
  label,
}: MinMaxInputProps) {
  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Input
        value={value}
        type="number"
        size="sm"
        onChange={onChange}
        onKeyPress={onEnter}
        sx={{ width: 70, "--Input-radius": "15px" }}
        slotProps={{
          input: {
            min: minValue,
            max: maxValue,
          },
        }}
      />
      <FormHelperText>{label}</FormHelperText>
    </FormControl>
  );
}
