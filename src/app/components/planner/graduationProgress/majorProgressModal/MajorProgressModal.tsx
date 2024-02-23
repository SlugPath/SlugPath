import { DefaultPlannerContext } from "@/app/contexts/DefaultPlannerProvider";
import useMajorRequirementLists from "@/app/hooks/useMajorRequirementLists";
import { Binder, RequirementList } from "@/app/types/Requirements";
import Search from "@components/search/Search";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { ModalsContext } from "@contexts/ModalsProvider";
import { PermissionsContext } from "@contexts/PermissionsProvider";
import {
  Button,
  Card,
  Chip,
  Modal,
  ModalClose,
  Sheet,
  Tooltip,
  Typography,
} from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { v4 as uuid4 } from "uuid";

import { Requirements, RequirementsEditing } from "./Requirements";

export default function MajorProgressModal() {
  const {
    setShowMajorProgressModal: setShowModal,
    showMajorProgressModal: showModal,
    setShowReplaceRLModal,
  } = useContext(ModalsContext);
  const { loadingSave, onSaveMajorRequirements } = useContext(
    MajorVerificationContext,
  );
  const { hasPermissionToEdit } = useContext(PermissionsContext);

  const [editing, setEditing] = useState(false);
  const { data: session } = useSession();
  const { userMajorData } = useContext(DefaultPlannerContext);
  const {
    majorRequirementLists,
    onAddMajorRequirementList,
    //onGetApprovedMajorRequirement,
    //onRemoveMajorRequirementList
  } = useMajorRequirementLists(userMajorData?.id);

  function Title() {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <Typography level="h4">Major Progress</Typography>
          {hasPermissionToEdit && (
            <Chip color="success" variant="solid" className="mr-6">
              You have edit permission
            </Chip>
          )}
        </div>
      </div>
    );
  }

  function handleToggleEditButton() {
    setEditing(!editing);
    if (editing) {
      onSaveMajorRequirements();
    }
  }

  return (
    <Modal
      open={showModal}
      onClose={() => {
        if (editing) {
          handleToggleEditButton();
        }
        setShowModal(false);
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        sx={{
          width: "60%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <div className="mb-4">
          <Title />
        </div>
        <div className="flex flex-row mb-3">
          {editing && showModal && hasPermissionToEdit && (
            <div className="flex-initial pr-2">
              <Card variant="soft" size="sm">
                <Search displayCustomCourseSelection={false} />
              </Card>
            </div>
          )}
          <div
            className="overflow-y-scroll w-full"
            style={{ maxHeight: "80vh" }}
          >
            {majorRequirementLists &&
              majorRequirementLists.map((majorRequirement: RequirementList) => (
                <div key={majorRequirement.id}>
                  {editing ? (
                    <RequirementsEditing
                      requirements={majorRequirement}
                      parents={0}
                    />
                  ) : (
                    <Requirements
                      requirements={majorRequirement}
                      parents={0}
                      hideTitle={false}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
        <EditButtons
          editing={editing}
          loadingSave={loadingSave}
          hasPermissionToEdit={hasPermissionToEdit}
          handleToggleEditButton={handleToggleEditButton}
          handleClickReplaceButton={() => setShowReplaceRLModal(true)}
        />
        <Button
          onClick={() => {
            const requirementList = {
              binder: Binder.AND,
              requirements: [
                {
                  binder: Binder.AND,
                  requirements: [
                    {
                      departmentCode: "CSE",
                      number: "100",
                      id: uuid4(),
                      title: "CSE 100",
                      credits: 4,
                      ge: [],
                      quartersOffered: [],
                      description: "CSE 100 description",
                      labels: [],
                    },
                    {
                      departmentCode: "CSE",
                      number: "101",
                      id: uuid4(),
                      title: "CSE 101",
                      credits: 4,
                      ge: [],
                      quartersOffered: [],
                      description: "CSE 101 description",
                      labels: [],
                    },
                  ],
                  id: uuid4(),
                  title: "child list",
                },
              ],
              id: uuid4(),
              title: "parent list",
            };
            const validUserId = session?.user.id || "";
            onAddMajorRequirementList(validUserId, 220, requirementList);
            //onRemoveMajorRequirementList(validUserId, 17);
            console.log(majorRequirementLists);
          }}
        >
          Add Requirement Suggestion
        </Button>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}

// this component decides which RequirementsComponent to render based on the editing prop
// will also display if there are no requirements
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MajorRequirements({
  majorRequirements,
  editing,
}: {
  majorRequirements: any;
  editing: boolean;
}) {
  return (
    <div className="overflow-y-scroll w-full" style={{ maxHeight: "80vh" }}>
      {editing ? (
        <RequirementsEditing requirements={majorRequirements} parents={0} />
      ) : (
        <Requirements
          requirements={majorRequirements}
          parents={0}
          hideTitle={false}
        />
      )}
    </div>
  );
}

function EditButtons({
  editing,
  loadingSave,
  hasPermissionToEdit,
  handleToggleEditButton,
  handleClickReplaceButton,
}: {
  editing: boolean;
  loadingSave: boolean;
  hasPermissionToEdit: boolean;
  handleToggleEditButton: () => void;
  handleClickReplaceButton: () => void;
}) {
  if (!hasPermissionToEdit) {
    return null;
  }

  return (
    <div className="flex flex-row justify-end">
      {loadingSave ? (
        <CircularProgress />
      ) : (
        <div className="space-x-2">
          {editing && (
            <Tooltip title="Replace with a Requirement List from a different program">
              <Button color="warning" onClick={handleClickReplaceButton}>
                Replace
              </Button>
            </Tooltip>
          )}
          <Button onClick={handleToggleEditButton}>
            {editing ? "Done" : "Edit Requirement List"}
          </Button>
        </div>
      )}
    </div>
  );
}
