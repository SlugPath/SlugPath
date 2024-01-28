import { PlaylistAddCheckCircleRounded } from "@mui/icons-material";
import { Button, Snackbar } from "@mui/joy";

export default function AutoFillSnackbar({
  openAutoFillSnackbar,
  setOpenAutoFillSnackbar,
}: {
  openAutoFillSnackbar: boolean;
  setOpenAutoFillSnackbar: (open: boolean) => void;
}) {
  const snackBarTime = 3000;

  return (
    <Snackbar
      variant="soft"
      color="primary"
      open={openAutoFillSnackbar}
      autoHideDuration={snackBarTime}
      onClose={() => setOpenAutoFillSnackbar(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      startDecorator={<PlaylistAddCheckCircleRounded />}
      endDecorator={
        <Button
          onClick={() => setOpenAutoFillSnackbar(false)}
          size="sm"
          variant="soft"
          color="primary"
        >
          Dismiss
        </Button>
      }
    >
      Auto Filled
    </Snackbar>
  );
}
