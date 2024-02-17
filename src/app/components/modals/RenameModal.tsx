import {
  Button,
  DialogActions,
  DialogTitle,
  FormControl,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { useEffect, useState } from "react";

//import TitleSnackbar from "../planners/plannerTabs/TitleSnackbar";

/** `RenameModalProps` contains the properties for a `RenameModal` component */
export interface RenameModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newTitle: string) => void;
  confirmButtonName?: string;
  title: string;
}

export default function RenameModal(props: RenameModalProps) {
  const { onClose, open, onConfirm, title } = props;
  const [text, setText] = useState(title);

  const isConfirmDisabled = text.length < 2; // Disable confirm button if text length is less than 2

  // Updates text everytime title is changed
  useEffect(() => {
    setText(title);
  }, [title]);

  function handleConfirm() {
    onConfirm(text);
    onClose();
  }

  function handleClose() {
    // Reset text to the initial title when the modal is closed without confirming
    setText(title);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="plain"
        size="md"
        sx={{ width: "30vw", maxWidth: "400px" }}
      >
        <ModalClose />
        {/* <TitleSnackbar error={text.length < 2} /> */}
        <DialogTitle sx={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>
          Rename
        </DialogTitle>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleConfirm();
          }}
        >
          <FormControl
            sx={{
              marginBottom: "0.75rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Input
              variant="soft"
              value={text}
              autoFocus={open}
              onFocus={(e) => e.currentTarget.select()}
              error={text.length < 2}
              size="sm"
              sx={{
                border: "1px solid #B8C1C5", // Set border color before focus
                "--Input-focusedInset": "var(--any, )",
                "--Input-focusedThickness": "0.25rem",
                "&::before": {
                  transition: "box-shadow .15s ease-in-out",
                },
                "&:focus-within": {
                  borderColor: "#86b7fe",
                },
              }}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm();
                }
              }}
            />
          </FormControl>
          <DialogActions>
            <Button
              variant="solid"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
            >
              {props.confirmButtonName ? props.confirmButtonName : "Confirm"}
            </Button>
            <Button variant="plain" color="neutral" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </ModalDialog>
    </Modal>
  );
}
