import { Input, Button, useColorScheme } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useContext, useState } from "react";
import ConfirmAlert from "../../ConfirmAlert";
import TooManyPlannersAlert from "./TooManyPlannersAlert";
import { PlannersContext } from "../../../contexts/PlannersProvider";
import TitleSnackbar from "../../TitleSnackbar";
import CloseIconButton from "../../CloseIconButton";
import { truncateTitle } from "@/lib/utils";

const MAX_PLANNERS = 10;

interface PlannerDeleteAlertData {
  id: string;
  title: string;
  alertOpen: boolean;
}
const emptyDeleteAlertData: PlannerDeleteAlertData = {
  id: "",
  title: "",
  alertOpen: false,
};

export default function PlannerTabs() {
  const {
    planners,
    removePlanner,
    switchPlanners,
    changePlannerName,
    addPlanner,
    activePlanner,
    plannersLoading,
  } = useContext(PlannersContext);

  // State-ful variables for managing the editing of planner names
  // and deletion alerts
  const [plannerBeingEdited, setPlannerBeingEdited] = useState<string | null>(
    null,
  );
  const [deleteAlert, setDeleteAlert] =
    useState<PlannerDeleteAlertData>(emptyDeleteAlertData);
  const [tooManyAlertIsOpen, setTooManyAlertIsOpen] = useState(false);

  /**
   * Event listener that runs when user clicks the add button
   */
  const handleAddPlanner = () => {
    // Check if user has too many planners open
    if (Object.keys(planners).length == MAX_PLANNERS) {
      setTooManyAlertIsOpen(true);
      return;
    }
    addPlanner();
  };

  /**
   * Callback to delete planner and close the alert modal
   * @param id planner id
   */
  const deletePlanner = (id: string) => {
    setDeleteAlert(emptyDeleteAlertData);
    removePlanner(id);
  };

  const handleOpenDeleteAlert = (id: string, title: string) => {
    setDeleteAlert({
      id,
      title: "Are you sure you want to delete your planner: " + title + "?",
      alertOpen: true,
    });
  };

  const handleBlur = (title: string) => {
    title.length >= 2 && setPlannerBeingEdited(null);
  };

  const handleTabChange = (index: number | string | null) => {
    if (typeof index === "string" && index !== "add-planner-tab") {
      const title = planners[index][0];
      switchPlanners(index, title);
    }
  };

  return (
    <>
      <div className="grid grid-flow-col gap-2 ml-1 overflow-x-auto">
        {Object.entries(planners).map(([id, [title]]) => (
          <CustomTab
            key={id}
            title={title}
            id={id}
            selected={activePlanner ? activePlanner.id === id : false}
            isEditing={plannerBeingEdited === id}
            setPlannerBeingEdited={setPlannerBeingEdited}
            onEndEditing={(newTitle) => {
              changePlannerName(newTitle, id);
              handleBlur(newTitle);
            }}
            onClick={() => handleTabChange(id)}
            onOpenDeleteAlert={handleOpenDeleteAlert}
          />
        ))}
        <Button
          loading={plannersLoading}
          aria-label="Add"
          onClick={() => handleAddPlanner()}
          size="sm"
          variant="plain"
          color="primary"
          startDecorator={<Add />}
        />
      </div>
      <ConfirmAlert
        open={deleteAlert.alertOpen}
        onClose={() => setDeleteAlert(emptyDeleteAlertData)}
        onConfirm={() => {
          deletePlanner(deleteAlert.id);
          setDeleteAlert(emptyDeleteAlertData);
        }}
        dialogText={deleteAlert.title}
      />
      <TooManyPlannersAlert
        open={tooManyAlertIsOpen}
        onClose={() => setTooManyAlertIsOpen(false)}
      />
    </>
  );
}

function CustomTab({
  title,
  id,
  isEditing,
  selected,
  setPlannerBeingEdited,
  onEndEditing,
  onClick,
  onOpenDeleteAlert,
}: {
  title: string;
  id: string;
  isEditing: boolean;
  selected: boolean;
  setPlannerBeingEdited: (id: string) => void;
  onEndEditing: (newTitle: string) => void;
  onClick: () => void;
  onOpenDeleteAlert: (id: string, title: string) => void;
}) {
  const { mode } = useColorScheme();
  const [text, setText] = useState(title);
  const [hovering, setHovering] = useState(false);

  function backgroundColor() {
    if (mode === "light") {
      if (hovering) {
        return "#BFDBFE";
      } else if (selected) {
        return "#3B82F6";
      } else {
        return "#93C5FD";
      }
    } else {
      if (hovering) {
        return "#334155";
      } else if (selected) {
        return "#3B82F6";
      } else {
        return "black";
      }
    }
  }

  function textColor() {
    if (mode === "light") {
      if (hovering) {
        return "#334155";
      } else if (selected) {
        return "#F1F5F9";
      } else {
        return "#334155";
      }
    } else {
      return "#F1F5F9";
    }
  }

  function handleClick() {
    if (selected) {
      setPlannerBeingEdited(id);
    } else {
      onClick();
    }
  }

  const cursorStyle = hovering ? { cursor: "pointer" } : {};

  return (
    <div
      className="p-2 rounded-3xl flex items-center justify-between"
      style={{
        backgroundColor: backgroundColor(),
        color: textColor(),
        minWidth: "7rem",
        ...cursorStyle,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleClick}
    >
      {isEditing ? (
        <>
          <TitleSnackbar error={text.length < 2} />
          <Input
            variant="soft"
            value={text}
            autoFocus
            error={text.length < 2}
            size="sm"
            sx={{
              "--Input-focusedInset": "var(--any, )",
              "--Input-focusedThickness": "0.25rem",
              "&::before": {
                transition: "box-shadow .15s ease-in-out",
              },
              "&:focus-within": {
                borderColor: "#86b7fe",
              },
              maxWidth: "20ch",
            }}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => onEndEditing(text)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEndEditing(text);
              }
            }}
          />
        </>
      ) : (
        <span className="truncate">{truncateTitle(text)}</span>
      )}
      <CloseIconButton onClick={() => onOpenDeleteAlert(id, title)} />
    </div>
  );
}
