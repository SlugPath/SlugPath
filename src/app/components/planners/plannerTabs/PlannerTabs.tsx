import { truncateTitle } from "@/lib/utils";
import { PlannersContext } from "@contexts/PlannersProvider";
import { Add } from "@mui/icons-material";
import { IconButton, Input, useColorScheme } from "@mui/joy";
import { useContext, useState } from "react";

import DropDownButton from "../../buttons/DropDownButton";
import ConfirmAlert from "../../modals/ConfirmAlert";
import TitleSnackbar from "./TitleSnackbar";
import TooManyPlannersAlert from "./TooManyPlannersAlert";

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
    duplicatePlanner,
    activePlanner,
  } = useContext(PlannersContext);

  // State-ful variables for managing the editing of planner names
  // and deletion alerts
  const [plannerBeingEdited, setPlannerBeingEdited] = useState<string | null>(
    null,
  );
  console.log("planners: ", planners);
  console.log("plannerBeingEdited: ", plannerBeingEdited);
  console.log("activePlanner: ", activePlanner);

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
    console.log("handleBlur");
    title.length >= 2 && setPlannerBeingEdited(null);
  };

  const handleTabChange = (id: string) => {
    console.log("handleTabChange");
    switchPlanners(id);
  };

  /**
   * Event listener that runs when user clicks the duplicate button
   */
  const handleDuplicatePlanner = (id: string) => {
    // Check if user has too many planners open
    if (Object.keys(planners).length == MAX_PLANNERS) {
      setTooManyAlertIsOpen(true);
      return;
    }
    duplicatePlanner(id);
  };

  return (
    <>
      <div className="grid grid-flow-col gap-2 ml-1 overflow-x-auto">
        {planners.map(({ id, title }) => (
          <CustomTab
            key={id}
            title={title}
            id={id}
            selected={activePlanner ? activePlanner === id : false}
            isEditing={plannerBeingEdited === id}
            setPlannerBeingEdited={setPlannerBeingEdited}
            onEndEditing={(newTitle) => {
              changePlannerName(id, newTitle);
              handleBlur(newTitle);
            }}
            onClick={() => handleTabChange(id)}
            onOpenDeleteAlert={handleOpenDeleteAlert}
            onDuplicate={() => handleDuplicatePlanner(id)}
          />
        ))}
        <IconButton
          aria-label="Add"
          onClick={() => handleAddPlanner()}
          size="sm"
          color="primary"
        >
          <Add />
        </IconButton>
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

type CustomTabProps = {
  title: string;
  id: string;
  isEditing: boolean;
  selected: boolean;
  setPlannerBeingEdited: (id: string) => void;
  onEndEditing: (newTitle: string) => void;
  onClick: () => void;
  onOpenDeleteAlert: (id: string, title: string) => void;
  onDuplicate: () => void;
};

function CustomTab({
  title,
  id,
  isEditing,
  selected,
  setPlannerBeingEdited,
  onEndEditing,
  onClick,
  onOpenDeleteAlert,
  onDuplicate,
}: CustomTabProps) {
  const { mode } = useColorScheme();
  const [text, setText] = useState(title);
  const [hovering, setHovering] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [renameFromDropDown, setRenameFromDropDown] = useState(false);
  //console.log("renameFromDropDown: ", renameFromDropDown);
  console.log("DropDownOpen: ", dropDownOpen);
  //console.log("isEditing:", isEditing);
  console.log("id:", id);

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
    console.log("handleClick");
    onClick();
  }

  function handleDoubleClick() {
    console.log("handleDoubleClick");
    if (selected) {
      setPlannerBeingEdited(id);
    } else {
      onClick();
    }
  }

  function handleRename() {
    console.log("handleRename");
    setRenameFromDropDown(true);
    if (selected) {
      setPlannerBeingEdited(id);
    }
  }

  const handleContextMenu = (e: any) => {
    console.log("handleContextMenu");
    e.preventDefault(); // Prevent the default right-click context menu
    setDropDownOpen(true); // Open the dropdown
  };

  // Needed to edit the blur event so that it was ignored on the transition from
  // the dropdown to the editing page
  const handleBlurEditing = (text: string) => {
    console.log("handleBlurEditing");
    if (!renameFromDropDown) {
      onEndEditing(text);
    }
    setRenameFromDropDown(false);
  };

  const handleDropDownClosed = (isClosed: boolean) => {
    setDropDownOpen(isClosed);
  };

  const cursorStyle = hovering ? { cursor: "pointer" } : {};
  // input ref set to null -> when you click input rename change input ref
  // dynamic map number of input references -> pass a refernce to each
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
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {isEditing ? (
        <>
          <TitleSnackbar error={text.length < 2} />
          <Input
            variant="soft"
            value={text}
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
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
            onBlur={() => handleBlurEditing(text)}
            /* onBlur={() => onEndEditing(text)} */
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEndEditing(text);
              }
            }}
          />
        </>
      ) : (
        <span className="truncate px-2">{truncateTitle(text)}</span>
      )}
      <DropDownButton
        id={id}
        title={title}
        onDeleteButtonClick={onOpenDeleteAlert}
        onDuplicateButtonClick={onDuplicate}
        onRenameButtonClick={handleRename}
        onRightClick={dropDownOpen}
        dropDownClosed={handleDropDownClosed}
      />
    </div>
  );
}
