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

/** `ConfirmAlertProps` contains the properties for a `ConfirmAlert` component */
export interface ConfirmAlertProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonName?: string;
  dialogText?: string;
}

export default function ConfirmAlert(props: ConfirmAlertProps) {
  const { onClose, open, onConfirm } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="plain" role="alertdialog">
        <DialogTitle>
          <WarningRounded />
          Confirmation
        </DialogTitle>
        <Divider />
        <DialogContent>
          {props.dialogText ? props.dialogText : `Are you sure?`}
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="danger" onClick={() => onConfirm()}>
            {props.confirmButtonName ? props.confirmButtonName : "Confirm"}
          </Button>
          <Button variant="plain" color="neutral" onClick={() => onClose()}>
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}

// export interface PlannerDeleteAlertProps {
//   open: OpenState;
//   onClose: () => void;
//   onDelete: (id: string) => void;
// }

// export default function PlannerDeleteAlert(props: PlannerDeleteAlertProps) {
//   const { onClose, open, onDelete } = props;
//   const [id, title] = open;

//   return (
//     <Modal open={id !== "" && title != ""} onClose={onClose}>
//       <ModalDialog variant="plain" role="alertdialog">
//         <DialogTitle>
//           <WarningRounded />
//           Confirmation
//         </DialogTitle>
//         <Divider />
//         <DialogContent>
//           Are you sure you want to delete your planner: {title}?
//         </DialogContent>
//         <DialogActions>
//           <Button variant="solid" color="danger" onClick={() => onDelete(id)}>
//             Delete planner
//           </Button>
//           <Button variant="plain" color="neutral" onClick={() => onClose()}>
//             Cancel
//           </Button>
//         </DialogActions>
//       </ModalDialog>
//     </Modal>
//   );
// }
