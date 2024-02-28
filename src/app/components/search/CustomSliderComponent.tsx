import { Box, Slider, Typography } from "@mui/joy";
import { useEffect, useState } from "react";

function valueText(value: number) {
  return `${value}`;
}

interface CustomSliderComponentProps {
  onSliderChange: (values: [number, number]) => void;
  defaultRangeValue: [number, number];
  sliderRange: number[];
  marks?: { value: number; label: string }[];
  label: string;
}

export default function CustomSliderComponent({
  onSliderChange,
  defaultRangeValue,
  sliderRange,
  marks,
  label,
}: CustomSliderComponentProps) {
  const [range, setRange] = useState<number[]>([
    defaultRangeValue[0],
    defaultRangeValue[1],
  ]);

  useEffect(() => {
    setRange([sliderRange[0], sliderRange[1]]);
  }, [sliderRange]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setRange(newValue as number[]);
  };

  const handleSliderChangeCommitted = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[],
  ) => {
    const newValues = newValue as number[];
    setRange(newValues);
    const newRange: [number, number] = newValue as [number, number];
    onSliderChange(newRange);
  };

  return (
    <div className="col-span-6">
      <Box sx={{ width: 235, margin: "auto" }}>
        <Typography sx={{ marginBottom: "0.5rem" }}>{label}</Typography>
        <Slider
          value={range}
          onChange={handleChange}
          onChangeCommitted={handleSliderChangeCommitted}
          valueLabelDisplay="auto"
          getAriaValueText={valueText}
          min={defaultRangeValue[0]}
          max={defaultRangeValue[1]}
          marks={marks}
          sx={{
            "--Slider-trackSize": "10px",
            "--Slider-markSize": "5px",
            "& .MuiSlider-valueLabel": {
              padding: "3px",
            },
            marginBottom: "0.05rem",
          }}
        />
      </Box>
    </div>
  );
}
