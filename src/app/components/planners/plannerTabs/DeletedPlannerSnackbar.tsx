import { PlaylistAddCheckCircleRounded } from "@mui/icons-material";
import { Button, Snackbar } from "@mui/joy";

export default function DeletedPlannerSnackbar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const snackBarTime = 3000;

  return (
    <>
      <Snackbar
        variant="soft"
        color="primary"
        open={open}
        autoHideDuration={snackBarTime}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        startDecorator={<PlaylistAddCheckCircleRounded />}
        endDecorator={
          <Button
            onClick={() => setOpen(false)}
            size="sm"
            variant="soft"
            color="primary"
          >
            Dismiss
          </Button>
        }
      >
        Deleted planner successfully!
      </Snackbar>
    </>
  );
}
