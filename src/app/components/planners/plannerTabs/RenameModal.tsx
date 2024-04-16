import WarningIcon from "@mui/icons-material/Warning";
import {
  Alert,
  Button,
  DialogActions,
  DialogTitle,
  FormControl,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { useEffect, useRef, useState } from "react";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isConfirmDisabled = text.length < 2; // Disable confirm button if text length is less than 2

  // Focus when the modal is opened
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (open) {
        inputRef.current?.focus();
      }
    }, 10);

    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  function handleConfirm() {
    onConfirm(text);
    onClose();
  }

  function handleClose() {
    // Reset text to the initial title
    setText(title);
    onClose();
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && text.length < 2) {
      e.preventDefault();
    } else if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="plain"
        size="md"
        sx={{ width: "30vw", maxWidth: "400px" }}
      >
        <ModalClose />
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
              marginBottom: text.length < 2 ? "0.5rem" : "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Input
              variant="soft"
              value={text}
              autoFocus
              onFocus={(e) => e.currentTarget.select()}
              error={text.length < 2}
              size="sm"
              slotProps={{
                input: {
                  ref: inputRef,
                },
              }}
              sx={{
                border: "1px solid #B8C1C5",
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
              onKeyDown={handleKeyDown}
            />
          </FormControl>
          {text.length < 2 && (
            <Alert
              startDecorator={<WarningIcon />}
              color="danger"
              size="sm"
              variant="soft"
              sx={{
                maxHeight: "25px",
                marginBottom: "0rem",
              }}
            >
              Title is too short.
            </Alert>
          )}
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
