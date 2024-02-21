import { findCoursesInQuarter, quartersPerYear } from "@/lib/plannerUtils";
import {
  CourseInfoContext,
  CourseInfoProvider,
} from "@contexts/CourseInfoProvider";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { ModalsContext, ModalsProvider } from "@contexts/ModalsProvider";
import { PermissionsProvider } from "@contexts/PermissionsProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { PlannerData } from "@customTypes/Planner";
import { Quarter } from "@customTypes/Quarter";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Card,
} from "@mui/joy";
import { useContext } from "react";

import MajorSelectionModal from "../majorSelection/MajorSelectionModal";
import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
import PermissionsModal from "../permissionsModal/PermissionsModal";
import Search from "../search/Search";
import NotesEditor from "./NotesEditor";
import PlannerActions from "./PlannerActions";
import StyledAccordion from "./StyledAccordion";
import { CreditsProgress } from "./graduationProgress/CreditsProgress";
import GEProgress from "./graduationProgress/GEProgress";
import GraduationProgress from "./graduationProgress/GraduationProgress";
import MajorProgress from "./graduationProgress/MajorProgress";
import MajorProgressModal from "./graduationProgress/majorProgressModal/MajorProgressModal";
import ReplaceRequirementsModal from "./graduationProgress/majorProgressModal/ReplaceRequirementsModal";
import QuarterCard from "./quarters/QuarterCard";

export default function Planner({ isActive }: { isActive: boolean }) {
  const { handleDragEnd, totalCredits, geSatisfied, courseState, updateNotes } =
    useContext(PlannerContext);

  if (!isActive) {
    return <></>;
  }

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <PermissionsProvider>
          <ModalsProvider>
            <CourseInfoProvider>
              <div className="flex justify-between space-x-4">
                <div className="flex-initial pr-2">
                  <SearchContainer />
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
                  <PlannerActions />
                  <GraduationProgressCard
                    totalCredits={totalCredits}
                    geSatisfied={geSatisfied}
                    courseState={courseState}
                  />
                </div>
              </div>
              <Modals />
            </CourseInfoProvider>
          </ModalsProvider>
        </PermissionsProvider>
      </DragDropContext>
    </div>
  );
}

// SearchContainer is used to hide the main Search component when another modal that uses the Search component is open,
// such as the CourseInfoModal or MajorProgressModal.
function SearchContainer() {
  const { showCourseInfoModal } = useContext(CourseInfoContext);
  const { showMajorProgressModal } = useContext(ModalsContext);

  return (
    <>
      {!showMajorProgressModal && !showCourseInfoModal ? (
        <Search displayCustomCourseSelection={true} />
      ) : (
        <Card className="w-80 h-full" />
      )}
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
  const { calculateMajorProgressPercentage } = useContext(
    MajorVerificationContext,
  );

  return (
    <Card variant="plain">
      <GraduationProgress
        credits={totalCredits}
        courseState={courseState}
        majorProgressPercentage={calculateMajorProgressPercentage(courseState)}
      />

      <div>
        <MajorProgress
          majorProgressPercentage={calculateMajorProgressPercentage(
            courseState,
          )}
        />
      </div>

      <div className="flex place-items-center">
        <CreditsProgress credits={totalCredits} />
      </div>

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
      <MajorSelectionModal />
      <MajorProgressModal />
      <ReplaceRequirementsModal />
      <PermissionsModal />
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
