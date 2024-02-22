import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormHelperText,
  Input,
  Slider,
  Stack,
  useColorScheme,
} from "@mui/joy";
import * as React from "react";

const marks = [
  { value: 0, label: "0" },
  { value: 100, label: "100" },
  { value: 200, label: "200" },
  { value: 299, label: "299" },
];

function valueText(value: number) {
  return `${value}`;
}

export default function CourseNumberSlider({
  onSliderChange,
}: {
  onSliderChange: (values: [number, number]) => void;
}) {
  const [range, setRange] = React.useState<number[]>([0, 299]);
  const [maxValue, setMaxValue] = React.useState("299");
  const [minValue, setMinValue] = React.useState("0");
  const { mode } = useColorScheme();

  const backgroundColor = mode === "light" ? "#f1f5f9" : "#181a1c";

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
      if (
        !isNaN(newMinValue) &&
        !isNaN(newMaxValue) &&
        newMinValue <= newMaxValue &&
        newMaxValue >= newMinValue
      ) {
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
    <Accordion
      className="col-span-6"
      sx={{
        textAlign: "center",
        backgroundColor,
        borderRadius: 8,
      }}
    >
      <AccordionSummary>Course Number Range</AccordionSummary>
      <AccordionDetails sx={{ borderRadius: "sm" }}>
        <Box sx={{ width: 235, margin: "auto", paddingTop: "1.3rem" }}>
          <Slider
            value={range}
            onChange={handleChange}
            onChangeCommitted={handleSliderChangeCommitted}
            valueLabelDisplay="auto"
            getAriaValueText={valueText}
            min={0}
            max={299}
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
        <Stack
          direction="row"
          justifyContent="center"
          spacing={3}
          sx={{ paddingTop: "0.75rem", margin: "auto" }}
        >
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Input
              value={minValue}
              type="number"
              placeholder="0"
              size="sm"
              onChange={handleMinInputChange}
              onKeyPress={handleInputKeyPress}
              sx={{ width: 70, "--Input-radius": "15px" }}
            />
            <FormHelperText>Min</FormHelperText>
          </FormControl>
          <div style={{ marginTop: "0.2rem" }}>
            <HorizontalRuleIcon />
          </div>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Input
              value={maxValue}
              type="number"
              placeholder="299"
              size="sm"
              onChange={handleMaxInputChange}
              onKeyPress={handleInputKeyPress}
              sx={{ width: 70, "--Input-radius": "15px" }}
            />
            <FormHelperText sx={{ magrinTop: "0rem" }}>Max</FormHelperText>
          </FormControl>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
