import { MAX_LABEL_NAME } from "@/lib/consts";
import { truncateTitle } from "@/lib/utils";
import { Label } from "@customTypes/Label";
import { Edit } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  Sheet,
  Typography,
} from "@mui/joy";
import { useState } from "react";

import CourseLabel from "../planner/quarters/courses/CourseLabel";

interface EditLabelsModalProps {
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
  labels: Label[];
  onUpdateLabels: (labels: Label[]) => void;
}

export default function EditLabelsModal({
  setShowModal,
  showModal,
  labels,
  onUpdateLabels,
}: EditLabelsModalProps) {
  const [editedLabels, setEditedLabels] = useState(labels);

  const handleLabelChange = (updatedLabel: Label) => {
    const currentIndex = editedLabels.findIndex(
      (editedLabel) => editedLabel.id === updatedLabel.id,
    );
    const newEditedLabels = [...editedLabels];
    newEditedLabels[currentIndex] = updatedLabel;
    setEditedLabels(newEditedLabels);
  };

  const handleSave = () => {
    onUpdateLabels(editedLabels);
    setShowModal(false);
  };

  const handleCancel = () => {
    setEditedLabels(labels);
    setShowModal(false);
  };

  return (
    <Modal
      open={showModal}
      onClose={handleCancel}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sheet
        sx={{
          width: "30%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          Edit Labels
        </Typography>
        <List>
          {editedLabels.map((label: Label, index: number) => (
            <LabelListItem
              key={index}
              label={label}
              index={index}
              onLabelChange={handleLabelChange}
            />
          ))}
        </List>
        <DialogActions>
          <Button variant="solid" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="plain" color="neutral" onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Sheet>
    </Modal>
  );
}

function LabelListItem({
  label,
  index,
  onLabelChange,
}: {
  label: Label;
  index: number;
  onLabelChange: (label: Label) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [labelName, setLabelName] = useState(label.name);
  const [updatedLabel, setUpdatedLabel] = useState(label);

  const handleEndEditing = () => {
    if (editing) {
      setEditing(false);
      const newLabel = { ...label };
      newLabel.name = truncateTitle(labelName, MAX_LABEL_NAME);
      onLabelChange(newLabel);
      setUpdatedLabel(newLabel);
    }
  };

  function displayText(): boolean {
    return labelName.length > 0 && !editing;
  }

  return (
    <ListItem key={index}>
      <CourseLabel label={updatedLabel} displayText={displayText()} inMenu>
        {editing ? (
          <Input
            variant="soft"
            value={labelName}
            autoFocus
            size="sm"
            placeholder="Label name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEndEditing();
              }
            }}
            onChange={(e) => setLabelName(e.target.value)}
          />
        ) : null}
      </CourseLabel>
      <IconButton
        onClick={() => {
          editing ? handleEndEditing() : setEditing(true);
        }}
      >
        <Edit />
      </IconButton>
    </ListItem>
  );
}
