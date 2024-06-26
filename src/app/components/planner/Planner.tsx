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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext, useMemo, useState } from "react";

import ConfirmAlert from "../modals/ConfirmAlert";
import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
import Search from "../search/Search";
import LabelLegend from "./LabelLegend";
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

  const isMobileView = useMediaQuery("((max-width: 1000px))");

  if (!isActive) {
    return <></>;
  }

  return (
    <div className="flex w-full flex-1 min-h-0">
      <DragDropContext onDragEnd={handleDragEnd}>
        <CourseInfoProvider>
          <div className="flex justify-between space-x-4 w-full min-h-0">
            <div className="hidden lg:flex flex-col min-h-0 flex-initial">
              <SearchContainer />
            </div>
            <div
              className="overflow-auto w-full flex-grow max-h-full"
              style={isMobileView ? { marginLeft: 0 } : {}}
            >
              <AccordionGroup>
                <div className="space-y-2 overflow-auto min-h-0">
                  <Years yearRange={yearRange} />
                  {!isMobileView && (
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
                          className="bg-[#0B6BCB] hover:bg-[#185EA5]"
                        >
                          Add Year
                        </Button>
                      )}
                    </div>
                  )}
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
            <div className="hidden lg:flex flex-col self-start gap-3 overflow-auto h-full min-w-[210px]">
              <GraduationProgressCard
                totalCredits={totalCredits}
                geSatisfied={geSatisfied}
                courseState={courseState}
              />
              <LabelLegend />
            </div>
          </div>
          <CourseInfoModal />
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

export function GraduationProgressCard({
  totalCredits,
  geSatisfied,
  courseState,
}: {
  totalCredits: number;
  geSatisfied: string[];
  courseState: PlannerData;
}) {
  const {
    calculateMajorProgressPercentage,
    calculateAllMajorProgressPercentages,
  } = useContext(MajorVerificationContext);

  return (
    <Card variant="plain">
      <GraduationProgress
        credits={totalCredits}
        courseState={courseState}
        majorProgressPercentage={calculateMajorProgressPercentage(courseState)}
      />
      <div>
        <MajorProgress
          majorProgressPercentages={calculateAllMajorProgressPercentages(
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

  const isColumnView = useMediaQuery(
    "((max-width: 600px) or ((min-width: 1000px) and (max-width: 1200px)))",
  );
  const isMobileView = useMediaQuery("((max-width: 1000px))");

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
          {!isMobileView ? (
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
                dialogText={
                  "Are you sure you want to delete Year " + year + "?"
                }
              />
            </IconButton>
          ) : (
            <IconButton />
          )}
        </AccordionSummary>
      </div>
      <AccordionDetails>
        <div
          className={`flex ${
            isColumnView ? "flex-col space-y-2" : "flex-row space-x-2"
          } overflow-auto`}
        >
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
