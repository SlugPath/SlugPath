import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { truncateTitle } from "@/lib/utils";
import usePlannersStore from "@/store/planner";
import { Add } from "@mui/icons-material";
import { IconButton, Input, Tooltip, useColorScheme } from "@mui/joy";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext, useState } from "react";

import PlannerDropDown from "../../buttons/PlannerDropDown";
import ConfirmAlert from "../../modals/ConfirmAlert";
import RenameModal from "./RenameModal";
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
  const planners = usePlannersStore((state) => state.planners);
  const setPlanners = usePlannersStore((state) => state.setPlanners);
  const activePlannerId = usePlannersStore((state) => state.activePlannerId);
  const setActivePlannerId = usePlannersStore(
    (state) => state.setActivePlannerId,
  );
  const isMobileView = useMediaQuery("((max-width: 1000px))");

  function removePlanner(id: string) {
    const newPlanners = planners.filter((planner) => planner.id !== id);
    setPlanners(newPlanners);
  }

  function duplicatePlanner(id: string) {
    const planner = planners.find((planner) => planner.id === id);
    if (planner) {
      const newPlanner = { ...planner, id: Date.now().toString() };
      setPlanners([...planners, newPlanner]);
    }
  }

  function changePlannerName(id: string, newTitle: string) {
    setPlanners(
      planners.map((planner) =>
        planner.id === id ? { ...planner, title: newTitle } : planner,
      ),
    );
  }

  const { setShowNewPlannerModal } = useContext(ModalsContext);

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
   * To add a planner, navigates to curriculum-select page
   * to allow user to choose a starting planner
   */
  const handleAddPlanner = () => {
    // Check if user has too many planners open
    if (planners.length == MAX_PLANNERS) {
      setTooManyAlertIsOpen(true);
      return;
    }

    setShowNewPlannerModal(true);
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

  const handleTabChange = (id: string) => {
    setActivePlannerId(id);
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
        {planners?.map(({ id, title }) => (
          <CustomTab
            key={id}
            title={title}
            id={id}
            selected={activePlannerId ? activePlannerId === id : false}
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
        {!isMobileView && (
          <Tooltip title="Create Planner" variant="soft">
            <IconButton
              aria-label="Add"
              onClick={() => handleAddPlanner()}
              size="sm"
              color="primary"
            >
              <Add />
            </IconButton>
          </Tooltip>
        )}
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
        warningContent="Too Many Planners"
        dialogContent="You have too many planners open. Delete one to make a new one."
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
  const [renameModalOpen, setRenameModalOpen] = useState(false);

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

  function handleDoubleClick() {
    if (selected) {
      setPlannerBeingEdited(id);
    } else {
      onClick();
    }
  }

  function handleOpenRenameModal() {
    if (selected) {
      setPlannerBeingEdited(id);
    }
    setRenameModalOpen(true);
  }

  const handleCloseRenameModal = () => {
    setRenameModalOpen(false);
  };

  const handleConfirmRenameModal = (newTitle: string) => {
    setText(newTitle);
    onEndEditing(newTitle);
    handleCloseRenameModal();
  };

  const handleContextMenu = (e: any) => {
    e.preventDefault(); // Prevent the default right-click context menu
    setDropDownOpen(true); // Open the dropdown
  };

  const handleBlurEditing = (text: string) => {
    onEndEditing(text);
  };

  const handleDropDownClosed = (isClosed: boolean) => {
    setDropDownOpen(isClosed);
  };

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
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
    >
      {isEditing ? (
        <>
          <TitleSnackbar error={text.length < 2} />
          <Input
            variant="soft"
            value={text}
            autoFocus={isEditing}
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
      <PlannerDropDown
        id={id}
        title={title}
        onRightClick={dropDownOpen}
        onDeleteButtonClick={onOpenDeleteAlert}
        onDuplicateButtonClick={onDuplicate}
        onRenameButtonClick={handleOpenRenameModal}
        dropDownClosed={handleDropDownClosed}
      />
      <RenameModal
        open={renameModalOpen}
        onClose={handleCloseRenameModal}
        onConfirm={handleConfirmRenameModal}
        title={title} // Pass the current title to the modal
      />
    </div>
  );
}
