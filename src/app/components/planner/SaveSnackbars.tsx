import { ApolloError } from "@apollo/client";
import {
  DangerousRounded,
  PlaylistAddCheckCircleRounded,
} from "@mui/icons-material";
import { Button, Snackbar } from "@mui/joy";
import { useEffect, useState } from "react";

export default function SaveSnackbars({
  saving,
  saveError,
}: {
  saving: boolean;
  saveError: ApolloError | undefined;
}) {
  const [saveOpen, setSaveOpen] = useState(false);
  const [errOpen, setErrOpen] = useState(false);
  const snackTime = 3000;

  useEffect(() => {
    if (saving) setSaveOpen(true);
  }, [saving]);

  useEffect(() => {
    if (saveError !== undefined) {
      setSaveOpen(false);
      setErrOpen(true);
    }
  }, [saveError]);

  return (
    <>
      {/* Snackbars to show save status */}
      <Snackbar
        variant="soft"
        color="primary"
        open={saveOpen}
        autoHideDuration={snackTime}
        onClose={() => setSaveOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        startDecorator={<PlaylistAddCheckCircleRounded />}
        endDecorator={
          <Button
            onClick={() => setSaveOpen(false)}
            size="sm"
            variant="soft"
            color="primary"
          >
            Dismiss
          </Button>
        }
      >
        Saving planner...
      </Snackbar>
      <Snackbar
        variant="soft"
        color="danger"
        open={errOpen}
        onClose={() => setErrOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        startDecorator={<DangerousRounded />}
        endDecorator={
          <Button
            onClick={() => setErrOpen(false)}
            size="sm"
            variant="soft"
            color="danger"
          >
            Dismiss
          </Button>
        }
      >
        Unable to save planner...
      </Snackbar>

      {/* End snackbars */}
    </>
  );
}
