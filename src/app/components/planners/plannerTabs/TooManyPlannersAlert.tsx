import { WarningRounded } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
} from "@mui/joy";

export interface TooManyPlannersAlertProps {
  open: boolean;
  onClose: () => void;
}

export default function TooManyPlannersAlert(props: TooManyPlannersAlertProps) {
  const { open, onClose } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRounded />
          Too Many Planners
        </DialogTitle>
        <Divider />
        <DialogContent>
          You have too many planners open. Delete one to make a new one.
        </DialogContent>
        <DialogActions>
          <Button variant="plain" color="neutral" onClick={() => onClose()}>
            OK
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
