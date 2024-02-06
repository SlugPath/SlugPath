import { Accordion } from "@mui/joy";

export default function StyledAccordion({
  defaultExpanded,
  children,
}: {
  defaultExpanded?: boolean;
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
      defaultExpanded={defaultExpanded ?? true}
    >
      {children}
    </Accordion>
  );
}
