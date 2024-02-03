import { Accordion } from "@mui/joy";

export default function StyledAccordion({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Accordion
      variant="soft"
      sx={{
        borderRadius: "0.5rem",
        "&.MuiAccordion-root": {
          "& .MuiAccordionSummary-root": {
            padding: "0.5rem 0",
            paddingX: "0.5rem",
          },
        },
      }}
      defaultExpanded={true}
    >
      {children}
    </Accordion>
  );
}
