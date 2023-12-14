import { WarningAmberOutlined } from "@mui/icons-material";
import { Alert } from "@mui/joy";
import { useEffect, useState } from "react";
import CloseIconButton from "./CloseIconButton";

export default function BetaWarning({ show = true }: { show?: boolean }) {
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    let timeoutId: any;
    if (!visible) {
      timeoutId = setTimeout(() => setShouldRender(false), 500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [visible]);

  return (
    shouldRender &&
    show && (
      <Alert
        onClick={() => setVisible(false)}
        size="lg"
        color="warning"
        variant="soft"
        startDecorator={<WarningAmberOutlined color="warning" />}
        sx={{
          cursor: "pointer",
          opacity: visible ? 1 : 0,
          transition: "opacity 350ms ease-in-out",
        }}
      >
        The UCSC Course Planner is currently in active development, and breaking
        changes are to be expected. Be sure to export any planners you have
        created to ensure that they are not lost.
        <CloseIconButton onClick={() => setVisible(false)} />
      </Alert>
    )
  );
}
