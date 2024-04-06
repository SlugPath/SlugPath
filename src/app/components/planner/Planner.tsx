import { findCoursesInQuarter, quartersPerYear } from "@/lib/plannerUtils";
import { getQuarterId } from "@/lib/quarterUtils";
import { CourseInfoProvider } from "@contexts/CourseInfoProvider";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { ModalsContext } from "@contexts/ModalsProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { PlannerData } from "@customTypes/Planner";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  Add,
  DeleteOutline,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Button,
  Card,
  IconButton,
  Tooltip,
} from "@mui/joy";
import { useContext, useMemo, useState } from "react";

import ConfirmAlert from "../modals/ConfirmAlert";
import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
import EditMajorRequirementsModal from "../modals/majorsModal/EditMajorRequirementsModal";
import MajorsModal from "../modals/majorsModal/MajorsModal";
import ReplaceRequirementsModal from "../modals/majorsModal/ReplaceRequirementsModal";
import PermissionsModal from "../permissionsModal/PermissionsModal";
import NewPlannerModal from "../planners/modals/NewPlannerModal";
import Search from "../search/Search";
import LabelLegend from "./LabelLegend";
import PlannerActions from "./PlannerActions";
import { CreditsProgress } from "./graduationProgress/CreditsProgress";
import GEProgress from "./graduationProgress/GEProgress";
import GraduationProgress from "./graduationProgress/GraduationProgress";
import MajorProgress from "./graduationProgress/MajorProgress";
import NotesEditor from "./notesEditor";
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

  const yearRange = useMemo(
    () => Array.from({ length: courseState.years }, (_, index) => index),
    [courseState],
  );

  const [isExpanded, setIsExpanded] = useState(true);
  if (!isActive) {
    return <></>;
  }

  return (
    <div className="flex w-full flex-1 min-h-0">
      <DragDropContext onDragEnd={handleDragEnd}>
        <CourseInfoProvider>
          <div className="flex justify-between space-x-4 w-full min-h-0">
            <div className="flex flex-col min-h-0 flex-initial">
              <SearchContainer />
            </div>
            <div className="overflow-auto w-full flex-grow max-h-full">
              <AccordionGroup>
                <div className="space-y-2 overflow-auto min-h-0">
                  <Years yearRange={yearRange} />
                  <div className="my-4">
                    {courseState.years == MAX_YEARS ? (
                      <Tooltip title="Cannot add more years.">
                        <span>
                          <Button
                            disabled
                            fullWidth={true}
                            size="lg"
                            startDecorator={<Add />}
                          >
                            Add Year
                          </Button>
                        </span>
                      </Tooltip>
                    ) : (
                      <Button
                        fullWidth={true}
                        size="lg"
                        onClick={addYear}
                        startDecorator={<Add />}
                      >
                        Add Year
                      </Button>
                    )}
                  </div>
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
                    <AccordionDetails className="mb-3">
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
              <LabelLegend />
            </div>
          </div>
          <Modals />
        </CourseInfoProvider>
      </DragDropContext>
    </div>
  );
}

// SearchContainer is used to hide the main Search component when another modal that uses the Search component is open,
// such as the CourseInfoModal or MajorProgressModal.
function SearchContainer() {
  const { showMajorsModal } = useContext(ModalsContext);

  // Don't show the virtualized search menu if the majorProgressModal is open
  if (showMajorsModal)
    return (
      <div className="flex flex-col gap-2 w-80 h-full">
        <Card className="h-20" />
        <Card className="h-full flex-1" />
      </div>
    );

  return <Search displayCustomCourseSelection />;
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
      <MajorsModal />
      <EditMajorRequirementsModal />
      <ReplaceRequirementsModal />
      <PermissionsModal />
      <NewPlannerModal />
    </>
  );
}

function Years({ yearRange }: { yearRange: number[] }) {
  return (
    <div className="space-y-2">
      {yearRange.map((i) => (
        <Year key={i} year={i + 1} />
      ))}
    </div>
  );
}

function Year({ year }: { year: number }) {
  const { deleteYear, courseState } = useContext(PlannerContext);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const startQuarters = quartersPerYear * (year - 1);
  const quarters = useMemo(
    () =>
      courseState.quarters.slice(
        startQuarters,
        startQuarters + quartersPerYear,
      ),
    [courseState, startQuarters],
  );

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
      <div>
        <AccordionSummary indicator={null} className="text-xl font-bold">
          {indicatorIcon(isExpanded)}
          Year {year}
          <IconButton>
            <DeleteOutline
              onClick={(e) => {
                // Prevent the accordion from expanding/collapsing
                e.stopPropagation();
                setDeleteAlertOpen(true);
              }}
            />
            <ConfirmAlert
              open={deleteAlertOpen}
              onClose={() => setDeleteAlertOpen(false)}
              onConfirm={() => deleteYear(year - 1)}
              dialogText={"Are you sure you want to delete Year " + year + "?"}
            />
          </IconButton>
        </AccordionSummary>
      </div>
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
