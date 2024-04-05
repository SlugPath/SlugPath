import Search from "@/app/components/search/Search";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { Program } from "@/app/types/Program";
import {
  Button,
  Card,
  Modal,
  ModalClose,
  Sheet,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useContext, useState } from "react";

import ReplaceRequirementsModal from "./ReplaceRequirementsModal";
import { RequirementsEditing } from "./Requirements";

type EditMajorRequirementsModalProps = {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  program: Program;
};

export default function EditMajorRequirementsModal({
  showModal,
  setShowModal,
  program,
}: EditMajorRequirementsModalProps) {
  const [showReplaceRLModal, setShowReplaceRLModal] = useState(false);

  const {
    getLoadingSave,
    getIsSaved,
    getRequirementsForMajor,
    onSaveMajorRequirements,
  } = useContext(MajorVerificationContext);

  const majorRequirements =
    program !== undefined ? getRequirementsForMajor(program.id) : undefined;
  const loadingSave =
    program !== undefined ? getLoadingSave(program?.id) : false;
  const isSaved = program !== undefined ? getIsSaved(program?.id) : false;

  function Title() {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between">
          <Typography level="h4">
            Editing {program?.name} {program?.catalogYear}
          </Typography>
        </div>
      </div>
    );
  }

  function handleSave() {
    onSaveMajorRequirements(program!.id);
  }

  return (
    <>
      <ReplaceRequirementsModal
        showModal={showReplaceRLModal}
        setShowModal={setShowReplaceRLModal}
        program={program}
      />
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
            width: "70%",
            minWidth: "50rem",
            margin: 10,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
            height: "80%",
            minHeight: "30rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="mb-4">
            <Title />
          </div>
          {program !== undefined && (
            <div className="flex min-h-0 flex-col flex-1">
              <div className="flex flex-row mb-3 flex-1 min-h-0">
                {showModal && (
                  <Card
                    variant="soft"
                    size="sm"
                    sx={{
                      height: "100%",
                      flex: "1 1 0%",
                      paddingRight: "0.5rem",
                    }}
                  >
                    <Search displayCustomCourseSelection={false} />
                  </Card>
                )}
                <div className="flex flex-col justify-between w-full overflow-auto h-full px-5 gap-5">
                  {majorRequirements ? (
                    <RequirementsEditing
                      requirements={majorRequirements}
                      parents={0}
                      major={program}
                    />
                  ) : (
                    <div>Major requirements could not be loaded.</div>
                  )}

                  {/* edit buttons start */}
                  <div className="flex flex-row justify-end space-x-2 min-h-0">
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
                </div>
              </div>
            </div>
          )}
          <ModalClose variant="plain" />
        </Sheet>
      </Modal>
    </>
  );
}
