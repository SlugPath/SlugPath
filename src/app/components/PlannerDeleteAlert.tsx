import { WarningRounded } from "@mui/icons-material";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions,
  Button,
} from "@mui/joy";

/** `OpenState` a tuple of a planner id and planner title */
export type OpenState = [string, string];

/** `PlannerAlertProps` contains the properties for a `PlannerAlert` component */
export interface PlannerDeleteAlertProps {
  open: OpenState;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function PlannerDeleteAlert(props: PlannerDeleteAlertProps) {
  const { onClose, open, onDelete } = props;
  const [id, title] = open;

  return (
    <Modal open={id !== "" && title != ""} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <WarningRounded />
          Confirmation
        </DialogTitle>
        <Divider />
        <DialogContent>
          Are you sure you want to delete your planner: {title}?
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="danger" onClick={() => onDelete(id)}>
            Delete planner
          </Button>
          <Button variant="plain" color="neutral" onClick={() => onClose()}>
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
