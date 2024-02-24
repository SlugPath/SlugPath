import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import { Box, Slider, Stack, Typography } from "@mui/joy";
import React, { useEffect } from "react";

import MinMaxInputComponent from "./MinMaxInputComponent";

function valueText(value: number) {
  return `${value}`;
}

interface CustomSliderComponentProps {
  onSliderChange: (values: [number, number]) => void;
  defaultRangeValue: [number, number];
  sliderRange: number[];
  marks?: { value: number; label: string }[];
  showMinMaxInputs?: boolean;
  label: string;
}

export default function CustomSliderComponent({
  onSliderChange,
  defaultRangeValue,
  sliderRange,
  marks,
  label,
  showMinMaxInputs = true,
}: CustomSliderComponentProps) {
  const [range, setRange] = React.useState<number[]>([
    defaultRangeValue[0],
    defaultRangeValue[1],
  ]);
  const [minValue, setMinValue] = React.useState(
    defaultRangeValue[0].toString(),
  );
  const [maxValue, setMaxValue] = React.useState(
    defaultRangeValue[1].toString(),
  );

  useEffect(() => {
    // Update slider range when numberRange or creditRange changes
    setRange([sliderRange[0], sliderRange[1]]);
    setMinValue(sliderRange[0].toString()); // Update min value
    setMaxValue(sliderRange[1].toString()); // Update max value
  }, [sliderRange]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setRange(newValue as number[]);
  };

  // Update slider value when min or max input field changes
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinValue(e.target.value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxValue(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newMinValue = parseInt(minValue);
      const newMaxValue = parseInt(maxValue);

      // Check if values are within valid range and min < max
      if (newMinValue <= newMaxValue) {
        setRange([
          isNaN(newMinValue) ? 0 : newMinValue,
          isNaN(newMaxValue) ? 299 : newMaxValue,
        ]);
        onSliderChange([
          isNaN(newMinValue) ? 0 : newMinValue,
          isNaN(newMaxValue) ? 299 : newMaxValue,
        ]);
      }

      // Prevent the default behavior of the Enter key if validation fails
      e.preventDefault();
    }
  };

  const handleSliderChangeCommitted = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[],
  ) => {
    const newValues = newValue as number[];
    setRange(newValues);
    setMinValue(newValues[0].toString());
    setMaxValue(newValues[1].toString());
    const newRange: [number, number] = newValue as [number, number];
    onSliderChange(newRange);
  };

  return (
    <div className="col-span-6">
      <Box sx={{ width: 235, margin: "auto" }}>
        <Typography sx={{ marginBottom: "1.5rem" }}>{label}</Typography>
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
            marginBottom: "0.75rem",
          }}
        />
      </Box>
      {showMinMaxInputs && (
        <Stack
          direction="row"
          justifyContent="center"
          spacing={3}
          sx={{ paddingTop: "0.75rem", margin: "auto" }}
        >
          <MinMaxInputComponent
            value={minValue}
            minValue={"0"}
            maxValue={maxValue}
            onChange={handleMinInputChange}
            onEnter={handleInputKeyPress}
            label="Min"
          />
          <div style={{ marginTop: "0.2rem" }}>
            <HorizontalRuleIcon />
          </div>
          <MinMaxInputComponent
            value={maxValue}
            minValue={minValue}
            maxValue={"299"}
            onChange={handleMaxInputChange}
            onEnter={handleInputKeyPress}
            label="Max"
          />
        </Stack>
      )}
    </div>
  );
}
