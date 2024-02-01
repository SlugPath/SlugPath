import { findCoursesInQuarter, quartersPerYear } from "@/lib/plannerUtils";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { ModalsProvider } from "@contexts/ModalsProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { PlannerData } from "@customTypes/Planner";
import { Quarter } from "@customTypes/Quarter";
import { DragDropContext } from "@hello-pangea/dnd";
import { CheckCircleRounded, WarningRounded } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Card,
  Typography,
} from "@mui/joy";
import { useContext, useEffect, useMemo } from "react";

import AutoFillSnackbar from "../AutoFillSnackbar";
import MajorSelectionModal from "../majorSelection/MajorSelectionModal";
import ExportModal from "../modals/ExportModal";
import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
import Search from "../search/Search";
import NotesEditor from "./NotesEditor";
import PlannerActionsCard from "./PlannerActionsCard";
import SaveSnackbars from "./SaveSnackbars";
import { GEProgress } from "./graduationProgress/GEProgress";
import { GradProgress } from "./graduationProgress/GradProgress";
import QuarterCard from "./quarters/QuarterCard";

export default function Planner({ isActive }: { isActive: boolean }) {
  const {
    handleDragEnd,
    totalCredits,
    geSatisfied,
    courseState,
    saveStatus,
    saveError,
    savePlanner,
    updateNotes,
    unsavedChanges,
  } = useContext(PlannerContext);
  const { hasAutoFilled, setHasAutoFilled } = useContext(DefaultPlannerContext);

  const icon = useMemo(
    () => (unsavedChanges ? <WarningRounded /> : <CheckCircleRounded />),
    [unsavedChanges],
  );

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (isActive && (event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        savePlanner();
      }
    };
    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [isActive, savePlanner]);

  if (!isActive) {
    return <></>;
  }

  return (
    <>
      <AutoFillSnackbar
        openAutoFillSnackbar={hasAutoFilled}
        setOpenAutoFillSnackbar={setHasAutoFilled}
      />
      <SaveSnackbars saving={saveStatus} saveError={saveError} />
      <div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <ModalsProvider>
            <div className="flex justify-between space-x-4">
              <div className="flex-initial pr-2">
                <Search />
              </div>
              <div className="flex flex-col w-full">
                <Typography
                  className="mb-2 text-center"
                  level="body-md"
                  justifyContent="center"
                  color="primary"
                  startDecorator={icon}
                >
                  {unsavedChanges
                    ? "You have unsaved changes..."
                    : "All changes saved"}
                </Typography>
                <h3 className="mb-2 text-center text-cyan-600"></h3>
                <div className="overflow-auto w-full flex-grow">
                  <AccordionGroup>
                    <div className="space-y-2 h-[75vh] overflow-auto">
                      <Years courseState={courseState} />
                      <Accordion
                        variant="soft"
                        sx={{
                          borderRadius: "0.5rem",
                          "&.MuiAccordion-root": {
                            "& .MuiAccordionSummary-root": {
                              padding: "0.5rem 0",
                              paddingX: "0.5rem",
                            },
                          },
                        }}
                        defaultExpanded={true}
                      >
                        <AccordionSummary>Notes</AccordionSummary>
                        <AccordionDetails>
                          <NotesEditor
                            content={courseState.notes}
                            onUpdateNotes={updateNotes}
                          />
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </AccordionGroup>
                </div>
              </div>

              <div className="flex flex-col self-start gap-3">
                <PlannerActionsCard />
                <GraduationProgressCard
                  totalCredits={totalCredits}
                  geSatisfied={geSatisfied}
                  courseState={courseState}
                />
              </div>
            </div>
            <Modals />
          </ModalsProvider>
        </DragDropContext>
      </div>
    </>
  );
}

function GraduationProgressCard({
  totalCredits,
  geSatisfied,
  courseState,
}: {
  totalCredits: number;
  geSatisfied: string[];
  courseState: PlannerData;
}) {
  return (
    <Card variant="plain">
      <div className="flex place-items-center">
        <GradProgress credits={totalCredits} />
      </div>

      <hr className="rounded border-t border-slate-300" />

      <div className="flex place-items-center">
        <GEProgress ge={geSatisfied} courseState={courseState} />
      </div>
    </Card>
  );
}

function Modals() {
  return (
    <>
      <CourseInfoModal />
      <ExportModal />
      <MajorSelectionModal />
    </>
  );
}

function Years({ courseState }: { courseState: PlannerData }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: quartersPerYear }, (_, index) => index).map((i) => {
        const slice_val = quartersPerYear * i;
        const quarters = courseState.quarters.slice(
          slice_val,
          slice_val + quartersPerYear,
        );

        return (
          <Quarters
            key={i}
            year={i + 1}
            quarters={quarters}
            courseState={courseState}
          />
        );
      })}
    </div>
  );
}

function StyledAccordion({ children }: { children: React.ReactNode }) {
  return (
    <Accordion
      variant="soft"
      sx={{
        borderRadius: "0.5rem",
        "&.MuiAccordion-root": {
          "& .MuiAccordionSummary-root": {
            padding: "0.5rem 0",
            paddingX: "0.5rem",
          },
        },
      }}
      defaultExpanded={true}
    >
      {children}
    </Accordion>
  );
}

function Quarters({
  year,
  quarters,
  courseState,
}: {
  year: number;
  quarters: Quarter[];
  courseState: PlannerData;
}) {
  return (
    <StyledAccordion>
      <AccordionSummary>Year {year}</AccordionSummary>
      <AccordionDetails>
        <div className="flex flex-row space-x-2">
          {quarters.map((quarter) => {
            const courses = findCoursesInQuarter(courseState, quarter.id);
            return (
              <QuarterCard
                id={quarter.id}
                key={quarter.id}
                title={quarter.title}
                courses={courses}
              />
            );
          })}
        </div>
      </AccordionDetails>
    </StyledAccordion>
  );
}
