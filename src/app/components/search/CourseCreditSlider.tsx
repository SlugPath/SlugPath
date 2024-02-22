import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Slider,
  useColorScheme,
} from "@mui/joy";
import * as React from "react";

const marks = [
  { value: 1, label: "1" },
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
];

function valueText(value: number) {
  return `${value}`;
}

export default function CourseCreditSlider({
  onSliderChange,
}: {
  onSliderChange: (values: [number, number]) => void;
}) {
  const [range, setRange] = React.useState<number[]>([1, 15]);
  const { mode } = useColorScheme();

  const backgroundColor = mode === "light" ? "#f1f5f9" : "#181a1c";

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
    <Accordion
      className="col-span-6"
      sx={{
        textAlign: "center",
        backgroundColor,
        borderRadius: 8,
      }}
    >
      <AccordionSummary>Course Credit Range</AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            width: 235,
            margin: "auto",
            paddingTop: "1.3rem",
            borderRadius: 8,
          }}
        >
          <Slider
            value={range}
            onChange={handleChange}
            onChangeCommitted={handleSliderChangeCommitted}
            valueLabelDisplay="on"
            getAriaValueText={valueText}
            min={1}
            max={15}
            marks={marks}
            sx={{
              "--Slider-trackSize": "10px",
              "--Slider-markSize": "5px",
              "& .MuiSlider-valueLabel": {
                padding: "3px",
              },
              marginBottom: "0.2rem",
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
