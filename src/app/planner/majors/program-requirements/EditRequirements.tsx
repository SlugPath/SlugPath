"use client";

import ConfirmAlert from "@/app/components/modals/ConfirmAlert";
import { RequirementsEditing } from "@/app/components/modals/majors/Requirements";
import Search from "@/app/components/search/Search";
import { CourseInfoProvider } from "@/app/contexts/CourseInfoProvider";
import {
  MajorVerificationContext,
  MajorVerificationProvider,
} from "@/app/contexts/MajorVerificationProvider";
import { ModalsContext, ModalsProvider } from "@/app/contexts/ModalsProvider";
import {
  PlannerContext,
  PlannerProvider,
} from "@/app/contexts/PlannerProvider";
import {
  PlannersContext,
  PlannersProvider,
} from "@/app/contexts/PlannersProvider";
import { useProgram } from "@/app/hooks/reactQuery";
import { DragDropContext } from "@hello-pangea/dnd";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Button, Tooltip, Typography } from "@mui/joy";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import ReplaceRequirementsModal from "./ReplaceRequirementsModal";

export default function EditRequirements() {
  return (
    <ModalsProvider>
      <PlannersProvider>
        <MajorVerificationProvider>
          <Container />
        </MajorVerificationProvider>
      </PlannersProvider>
    </ModalsProvider>
  );
}

function Container() {
  const { activePlanner } = useContext(PlannersContext);

  if (activePlanner === undefined) return <div></div>;

  return (
    <PlannerProvider plannerId={activePlanner} title={""} order={0}>
      <Component />
    </PlannerProvider>
  );
}

function Component() {
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

  const { handleDragEnd } = useContext(PlannerContext);
  const { setMajorToEdit, setShowReplaceRLModal } = useContext(ModalsContext);

  useEffect(() => {
    if (major) {
      setMajorToEdit(major);
    }
  }, [major, setMajorToEdit]);

  if (!major) {
    return <div>Major not found</div>;
  }

  const majorRequirements =
    major !== undefined ? getRequirementsForMajor(major.id) : undefined;
  const loadingSave = major !== undefined ? getLoadingSave(major.id) : false;
  const isSaved = major !== undefined ? getIsSaved(major.id) : false;

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
    <DragDropContext onDragEnd={handleDragEnd}>
      <CourseInfoProvider>
        <div className="flex flex-row p-4 pb-0 justify-between">
          <div className="flex flex-row">
            <Title />
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
      </CourseInfoProvider>
    </DragDropContext>
  );
}
