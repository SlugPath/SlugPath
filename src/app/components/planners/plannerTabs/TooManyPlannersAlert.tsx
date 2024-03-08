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
  warningContent: string;
  dialogContent: string;
}

export default function TooManyPlannersAlert(props: TooManyPlannersAlertProps) {
  const { open, onClose, warningContent, dialogContent } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRounded />
          {warningContent}
        </DialogTitle>
        <Divider />
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button variant="plain" color="neutral" onClick={() => onClose()}>
            OK
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
