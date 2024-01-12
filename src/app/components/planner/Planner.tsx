import QuarterCard from "./quarters/QuarterCard";
import { quartersPerYear } from "../../../lib/plannerUtils";
import { PlannerData, findCoursesInQuarter } from "../../types/PlannerData";
import Search from "../search/Search";
import { DragDropContext } from "@hello-pangea/dnd";
import SaveSnackbars from "./SaveSnackbars";
import { Card } from "@mui/joy";
import { GradProgress } from "./graduationProgress/GradProgress";
import { GEProgress } from "./graduationProgress/GEProgress";
import { PlannerContext } from "../../contexts/PlannerProvider";
import { useContext } from "react";
import { ModalsProvider } from "../../contexts/ModalsProvider";
import ExportModal from "../ExportModal";
import CourseInfoModal from "../courseInfoModal/CourseInfoModal";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
} from "@mui/joy";
import { Quarter } from "../../types/Quarter";
import MajorSelectionModal from "../majorSelection/MajorSelectionModal";
import NotesEditor from "./NotesEditor";
import AutoFillSnackbar from "../AutoFillSnackbar";
import { DefaultPlannerContext } from "../../contexts/DefaultPlannerProvider";
import PlannerActionsCard from "./PlannerActionsCard";
import MajorProgress from "./graduationProgress/MajorProgress";
import { MajorVerificationProvider } from "@/app/contexts/MajorVerificationProvider";
import MajorProgressModal from "./graduationProgress/MajorProgressModal";

export default function Planner({ isActive }: { isActive: boolean }) {
  const {
    handleDragEnd,
    totalCredits,
    geSatisfied,
    courseState,
    saveStatus,
    saveError,
    updateNotes,
  } = useContext(PlannerContext);
  const { hasAutoFilled, setHasAutoFilled } = useContext(DefaultPlannerContext);

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
            <MajorVerificationProvider>
              <div className="flex justify-between space-x-4">
                <div className="flex-initial pr-2">
                  <Search />
                </div>
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
            </MajorVerificationProvider>
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
      <div>
        <MajorProgress />
      </div>

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
      <MajorProgressModal />
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
