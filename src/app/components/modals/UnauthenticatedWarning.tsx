import { WarningAmberRounded } from "@mui/icons-material";
import { Typography } from "@mui/joy";

export default function UnauthenticatedWarning() {
  return (
    <Typography
      variant="soft"
      color="warning"
      component="p"
      startDecorator={<WarningAmberRounded color="warning" />}
      justifyContent="center"
      className="py-2 px-6 rounded-b-2xl"
    >
      We recommend logging in with your UCSC email in order to save your data.
    </Typography>
  );
}
