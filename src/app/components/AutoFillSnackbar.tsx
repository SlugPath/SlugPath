import { Snackbar, Button } from "@mui/joy";
import { PlaylistAddCheckCircleRounded } from "@mui/icons-material";

export default function AutoFillSnackbar({
  openAutoFillSnackbar,
  setOpenAutoFillSnackbar,
}: {
  openAutoFillSnackbar: boolean;
  setOpenAutoFillSnackbar: (open: boolean) => void;
}) {
  const snackBarTime = 3000;

  return (
    <>
      <Snackbar
        variant="soft"
        color="success"
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
            color="success"
          >
            Dismiss
          </Button>
        }
      >
        Auto Filled
      </Snackbar>
    </>
  );
}
