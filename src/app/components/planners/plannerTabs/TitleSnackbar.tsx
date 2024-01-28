import { Warning } from "@mui/icons-material";
import { Snackbar } from "@mui/joy";

export default function TitleSnackbar({ error }: { error: boolean }) {
  return (
    <Snackbar
      open={error}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      startDecorator={<Warning />}
      variant="soft"
      color="danger"
    >
      Title is too short. Must be at least 2 characters.
    </Snackbar>
  );
}
