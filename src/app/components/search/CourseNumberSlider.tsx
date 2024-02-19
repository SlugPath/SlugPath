import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Slider,
  Stack,
  Typography,
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

export default function CourseNumberSlider() {
  const [value, setValue] = React.useState<number[]>([0, 299]);
  const [maxValue, setMaxValue] = React.useState("299");
  const [minValue, setMinValue] = React.useState("0");
  const { mode } = useColorScheme();

  const backgroundColor = mode === "light" ? "#f1f5f9" : "#181a1c";

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
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
        setValue([
          isNaN(newMinValue) ? 0 : newMinValue,
          isNaN(newMaxValue) ? 299 : newMaxValue,
        ]);
      }

      // Prevent the default behavior of the Enter key if validation fails
      e.preventDefault();
    }
  };

  return (
    <div
      style={{
        width: 270,
        marginBottom: "0.5rem",
        textAlign: "center",
        backgroundColor,
        borderRadius: 4,
        paddingBottom: "1rem",
      }}
    >
      <Box sx={{ width: 235, margin: "auto" }}>
        <Typography
          sx={{ borderRadius: 4, padding: 0.75, marginBottom: "0.75rem" }}
          gutterBottom
        >
          Course Number Range
        </Typography>
        <Slider
          getAriaLabel={() => "Temperature range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valueText}
          min={0}
          max={299}
          marks={marks}
          //variant="soft"
          sx={{
            "--Slider-trackSize": "10px",
            "--Slider-markSize": "5px",
            "& .MuiSlider-valueLabel": {
              // Target the value label component
              padding: "3px",
              //color: 'red', // Set the color
            },
            marginBottom: "0.75rem",
          }}
        />
      </Box>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        sx={{ padding: 1, margin: "auto" }}
      >
        <FormControl>
          <FormLabel>Min</FormLabel>
          <Input
            value={minValue}
            //type="number"
            placeholder="0"
            size="sm"
            //onChange={(e) => setMinValue(e.target.value)}
            onChange={handleMinInputChange}
            onKeyPress={handleInputKeyPress}
            sx={{ width: 100 }}
          />
        </FormControl>
        <Typography>-</Typography>
        <FormControl>
          <FormLabel>Max</FormLabel>
          <Input
            value={maxValue}
            //type="number"
            placeholder="299"
            size="sm"
            //onChange={(e) => setMaxValue(e.target.value)}
            onChange={handleMaxInputChange}
            onKeyPress={handleInputKeyPress}
            sx={{ width: 100 }}
          />
        </FormControl>
      </Stack>
    </div>
  );
}
