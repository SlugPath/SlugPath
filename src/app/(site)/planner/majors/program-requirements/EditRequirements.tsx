"use client";

import { RequirementsEditing } from "@/app/(site)/planner/majors/Requirements";
import ConfirmAlert from "@components/modals/ConfirmAlert";
import CourseInfoModal from "@components/modals/courseInfoModal/CourseInfoModal";
import Search from "@components/search/Search";
import { CourseInfoProvider } from "@contexts/CourseInfoProvider";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { ModalsContext } from "@contexts/ModalsProvider";
import { DragDropContext } from "@hello-pangea/dnd";
import { useProgram } from "@hooks/reactQuery";
import useHandleRequirementListDrag from "@hooks/useHandleRequirementListDrag";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Button, Tooltip } from "@mui/joy";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import ReplaceRequirementsModal from "./ReplaceRequirementsModal";

export default function EditRequirements() {
  const params = useParams();
  const majorIdString = params.majorId as string;
  const majorId = majorIdString ? parseInt(majorIdString) : undefined;

  // state for ConfirmAlert to ensure user does not accidentally discard changes
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { data: major } = useProgram(majorId!);

  const {
    getLoadingSave,
    getIsSaved,
    getRequirementsForMajor,
    onSaveMajorRequirements,
  } = useContext(MajorVerificationContext);

  const { majorToEdit, setMajorToEdit, setShowReplaceRLModal } =
    useContext(ModalsContext);

  // This is a little duplicative, but it's necessary to indicate that the client state and server state are separate
  // In the future this can be streamlined by removing ModalsContext and using a store for MajorVerificationContext
  useEffect(() => {
    if (major) {
      setMajorToEdit(major);
    }
  }, [major, setMajorToEdit]);

  const { handleDragEnd } = useHandleRequirementListDrag(majorToEdit);

  if (!major) {
    return <div>Major not found</div>;
  }

  const majorRequirements =
    major !== undefined ? getRequirementsForMajor(major.id) : undefined;
  const loadingSave = major !== undefined ? getLoadingSave(major.id) : false;
  const isSaved = major !== undefined ? getIsSaved(major.id) : false;

  function handleSave() {
    onSaveMajorRequirements(major!.id);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <CourseInfoProvider>
        <div className="flex flex-row p-4 pb-0 justify-between">
          <div className="flex flex-row items-center">
            <p className="font-semibold text-xl">
              Editing {major?.name} {major?.catalogYear}
            </p>
            <Button
              variant="plain"
              onClick={() => {
                if (isSaved) {
                  router.push("/planner/majors");
                } else {
                  setOpen(true);
                }
              }}
              startDecorator={<KeyboardArrowLeftIcon fontSize="large" />}
              sx={{ width: "fit-content" }}
            >
              Back to Majors
            </Button>
          </div>

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
        <div className="flex w-full flex-1 min-h-0 p-4">
          {major !== undefined && (
            <div className="flex justify-between space-x-4 w-full min-h-0">
              <div className="flex flex-row min-h-0 flex-initial">
                <Search displayCustomCourseSelection={false} />
              </div>
              <div className="overflow-auto w-full flex-grow max-h-full">
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
          )}
        </div>
        <ConfirmAlert
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => router.push("/planner/majors")}
          dialogText="Are you sure you want to leave without saving changes?"
          confirmButtonName="Yes, discard changes"
        />
        <ReplaceRequirementsModal />
        <CourseInfoModal />
      </CourseInfoProvider>
    </DragDropContext>
  );
}
