import Search from "@/app/components/search/Search";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import useMajorRequirementLists from "@/app/hooks/useMajorRequirementLists";
import { RequirementList } from "@/app/types/Requirements";
import {
  Button,
  Card,
  Modal,
  ModalClose,
  Sheet,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useContext, useEffect, useState } from "react";

import { RequirementsEditing } from "./Requirements";

export default function EditMajorRequirementsModal() {
  const {
    setShowMajorRequirementsEditModal: setShowModal,
    showMajorRequirementsEditModal: showModal,
    setShowReplaceRLModal,
    majorToEdit: major,
    userToEdit: userId,
  } = useContext(ModalsContext);
  const {
    getLoadingSave,
    getIsSaved,
    getRequirementsForMajor,
    onSaveMajorRequirements,
  } = useContext(MajorVerificationContext);

  const { onGetMajorRequirementList } = useMajorRequirementLists(major?.id);

  const [majorRequirements, setMajorRequirements] = useState<RequirementList>();

  // Need to wait for getMajorRequirementList Fetch
  useEffect(() => {
    const getMajorRequirments = async () => {
      if (!major) return;
      if (!userId) {
        const _majorRequirements = getRequirementsForMajor(major.id);
        setMajorRequirements(_majorRequirements);
        return;
      }

      const _majorRequirements = await onGetMajorRequirementList(
        userId,
        major.id,
      );
      setMajorRequirements(_majorRequirements ?? undefined);
    };
    getMajorRequirments();
  }, [onGetMajorRequirementList, getRequirementsForMajor]);

  //if there's a user, grab the user's suggestion instead

  const loadingSave = major !== undefined ? getLoadingSave(major?.id) : false;
  const isSaved = major !== undefined ? getIsSaved(major?.id) : false;

  function Title() {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <Typography level="h4">
            Editing {major?.name} {major?.catalogYear}
          </Typography>
        </div>
      </div>
    );
  }

  function handleSave() {
    onSaveMajorRequirements(major!.id);
  }

  return (
    <Modal
      open={showModal}
      onClose={() => {
        handleSave();
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
        {major !== undefined && (
          <>
            <div className="flex flex-row mb-3">
              {showModal && (
                <div className="flex-1 pr-2">
                  <Card variant="soft" size="sm">
                    <Search displayCustomCourseSelection={false} />
                  </Card>
                </div>
              )}
              <div className="w-full overflow-auto h-[80vh]">
                {majorRequirements ? (
                  <RequirementsEditing
                    requirements={majorRequirements}
                    parents={0}
                    major={major}
                  />
                ) : (
                  <div>Major requirements could not be loaded.</div>
                )}
              </div>
            </div>

            {/* edit buttons start */}
            <div className="flex flex-row justify-end space-x-2">
              <Tooltip title="Replace with a Requirement List from a different program">
                <Button
                  color="warning"
                  onClick={() => setShowReplaceRLModal(true)}
                >
                  Replace
                </Button>
              </Tooltip>
              <Button
                disabled={isSaved}
                onClick={handleSave}
                loading={loadingSave}
              >
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
            {/* edit buttons end */}
          </>
        )}
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
