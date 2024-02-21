import useMajorSelection from "@/app/components/majorSelection/useMajorSelection";
import Search from "@/app/components/search/Search";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import useMajorRequirementLists from "@/app/hooks/useMajorRequirementLists";
import useUserPermissions from "@/app/hooks/useUserPermissions";
import { Binder } from "@/app/types/Requirements";
//import { List } from "@mui/icons-material";
import {
  Button,
  Card,
  Chip,
  Modal,
  ModalClose,
  Sheet,
  Typography,
} from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { v4 as uuid4 } from "uuid";

import {
  RequirementsComponent,
  RequirementsComponentEditing,
} from "./RequirementsComponent";

export default function MajorProgressModal() {
  const {
    setShowMajorProgressModal: setShowModal,
    showMajorProgressModal: showModal,
  } = useContext(ModalsContext);
  const { loadingSave, majorRequirements, onSaveMajorRequirements } =
    useContext(MajorVerificationContext);
  const { hasPermissionToEdit } = useUserPermissions();
  const [editing, setEditing] = useState(false);
  const { data: session } = useSession();
  const { userMajorData } = useMajorSelection(session?.user.id);
  const {
    majorRequirementLists,
    onAddMajorRequirementList,
    //onGetApprovedMajorRequirement,
    //onRemoveMajorRequirementList
  } = useMajorRequirementLists(userMajorData?.id);

  function Title() {
    return (
      <div className="flex flex-col space-y-2">
        <Typography level="h4">Major Progress</Typography>
        <Typography level="title-lg">{majorRequirements.title}</Typography>
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
              majorRequirementLists.map((majorRequirement) => (
                <div key={majorRequirement.id}>
                  {editing ? (
                    <RequirementsComponentEditing
                      requirements={majorRequirement}
                      parents={0}
                    />
                  ) : (
                    <RequirementsComponent
                      requirements={majorRequirement}
                      parents={0}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
        {hasPermissionToEdit && (
          <div className="flex flex-row justify-end space-x-2">
            <Chip color="success" variant="solid">
              You have edit permission
            </Chip>
            {loadingSave ? (
              <CircularProgress />
            ) : (
              <Button onClick={handleToggleEditButton}>
                {editing ? "Done" : "Edit"}
              </Button>
            )}
          </div>
        )}
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
