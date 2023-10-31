import {
  Modal,
  ModalDialog,
  DialogTitle,
  Stack,
  FormLabel,
  Input,
  Button,
  FormControl,
} from "@mui/joy";
import { useState } from "react";

export interface PlannerAddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

export default function PlannerAddModal(props: PlannerAddModalProps) {
  const { open, onClose, onSubmit } = props;
  const [title, setTitle] = useState("");

  return (
    <Modal open={open} onClose={() => onClose()}>
      <ModalDialog>
        <DialogTitle>Create new planner</DialogTitle>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onSubmit(title);
            setTitle("");
            onClose();
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Planner Title</FormLabel>
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <Button type="submit">Create</Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
