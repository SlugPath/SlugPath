import { findCoursesInQuarter, quartersPerYear } from "@/lib/plannerUtils";
import { getQuarterId } from "@/lib/quarterUtils";
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
import { DeleteOutline, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Button,
  Card,
  IconButton,
} from "@mui/joy";
import { useContext, useState } from "react";

import MajorSelectionModal from "../majorSelection/MajorSelectionModal";
import ConfirmAlert from "../modals/ConfirmAlert";
import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
import PermissionsModal from "../permissionsModal/PermissionsModal";
import TooManyPlannersAlert from "../planners/plannerTabs/TooManyPlannersAlert";
import Search from "../search/Search";
import NotesEditor from "./NotesEditor";
import PlannerActions from "./PlannerActions";
import { CreditsProgress } from "./graduationProgress/CreditsProgress";
import GEProgress from "./graduationProgress/GEProgress";
import GraduationProgress from "./graduationProgress/GraduationProgress";
import MajorProgress from "./graduationProgress/MajorProgress";
import MajorProgressModal from "./graduationProgress/majorProgressModal/MajorProgressModal";
import ReplaceRequirementsModal from "./graduationProgress/majorProgressModal/ReplaceRequirementsModal";
import QuarterCard from "./quarters/QuarterCard";

const MAX_YEARS = 10;

export default function Planner({ isActive }: { isActive: boolean }) {
  const {
    handleDragEnd,
    totalCredits,
    geSatisfied,
    courseState,
    updateNotes,
    addYear,
  } = useContext(PlannerContext);

  const [tooManyYearsAlertOpen, setTooManyYearsAlertOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
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
                      <Button
                        onClick={() => {
                          if (courseState.years < MAX_YEARS) {
                            addYear();
                          } else {
                            setTooManyYearsAlertOpen(true);
                          }
                        }}
                        fullWidth={true}
                        size="lg"
                      >
                        Add Year
                      </Button>
                      <TooManyPlannersAlert
                        open={tooManyYearsAlertOpen}
                        onClose={() => setTooManyYearsAlertOpen(false)}
                        warningContent="Too Many Years"
                        dialogContent="You have too many years open. Delete one to add a new one."
                      />
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
                        expanded={isExpanded === true}
                        onChange={(_, expanded) => {
                          setIsExpanded(expanded ? true : false);
                        }}
                      >
                        <AccordionSummary indicator={null}>
                          {indicatorIcon(isExpanded)}
                          Notes
                          <IconButton />
                        </AccordionSummary>
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
      {Array.from({ length: courseState.years }, (_, index) => index).map(
        (i) => {
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
        },
      )}
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
  const { deleteYear } = useContext(PlannerContext);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

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
      expanded={isExpanded === true}
      onChange={(_, expanded) => {
        setIsExpanded(expanded ? true : false);
      }}
    >
      <Box>
        <AccordionSummary indicator={null}>
          {indicatorIcon(isExpanded)}
          Year {year}
          <IconButton>
            <DeleteOutline onClick={() => setDeleteAlertOpen(true)} />
            <ConfirmAlert
              open={deleteAlertOpen}
              onClose={() => setDeleteAlertOpen(false)}
              onConfirm={() => deleteYear(year - 1)}
              dialogText={"Are you sure you want to delete Year " + year + "?"}
            />
          </IconButton>
        </AccordionSummary>
      </Box>
      <AccordionDetails>
        <div className="flex flex-row space-x-2">
          {quarters.map((quarter) => {
            const courses = findCoursesInQuarter(courseState, quarter);
            const id = getQuarterId(quarter);
            return (
              <QuarterCard
                key={id}
                id={id}
                title={quarter.title}
                courses={courses}
              />
            );
          })}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

function indicatorIcon(isExpanded: boolean) {
  if (isExpanded == true) {
    return (
      <IconButton>
        <ExpandLess />
      </IconButton>
    );
  } else {
    return (
      <IconButton>
        <ExpandMore />
      </IconButton>
    );
  }
}
