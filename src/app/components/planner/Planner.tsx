import { findCoursesInQuarter, quartersPerYear } from "@/lib/plannerUtils";
import { getQuarterId } from "@/lib/quarterUtils";
import { CourseInfoProvider } from "@contexts/CourseInfoProvider";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { ModalsContext } from "@contexts/ModalsProvider";
import { PermissionsProvider } from "@contexts/PermissionsProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { PlannerData } from "@customTypes/Planner";
import { Quarter } from "@customTypes/Quarter";
import { Dialog, Transition } from "@headlessui/react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  Add,
  Close,
  DeleteOutline,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Button,
  Card,
  IconButton,
  Tooltip,
} from "@mui/joy";
import { Fragment, useContext, useState } from "react";

import CloseIconButton from "../buttons/CloseIconButton";
import ConfirmAlert from "../modals/ConfirmAlert";
import CourseInfoModal from "../modals/courseInfoModal/CourseInfoModal";
import EditMajorRequirementsModal from "../modals/majorsModal/EditMajorRequirementsModal";
import MajorsModal from "../modals/majorsModal/MajorsModal";
import ReplaceRequirementsModal from "../modals/majorsModal/ReplaceRequirementsModal";
import PermissionsModal from "../permissionsModal/PermissionsModal";
import Search from "../search/Search";
import NotesEditor from "./NotesEditor";
import PlannerActions from "./PlannerActions";
import { CreditsProgress } from "./graduationProgress/CreditsProgress";
import GEProgress from "./graduationProgress/GEProgress";
import GraduationProgress from "./graduationProgress/GraduationProgress";
import MajorProgress from "./graduationProgress/MajorProgress";
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

  const [isNotesExpanded, setIsExpanded] = useState(true);
  const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(true);

  if (!isActive) {
    return <></>;
  }

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <PermissionsProvider>
          <CourseInfoProvider>
            <div className="flex justify-between space-x-4">
              <div className="flex-initial pr-2">
                <SearchContainer />
              </div>
              <div className="overflow-auto w-full flex-grow">
                <AccordionGroup>
                  <div className="space-y-2 h-[75vh] overflow-auto">
                    <Years courseState={courseState} />
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
                              {" "}
                              Add Year{" "}
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
                      expanded={isNotesExpanded === true}
                      onChange={(_, expanded) => {
                        setIsExpanded(expanded ? true : false);
                      }}
                    >
                      <AccordionSummary indicator={null}>
                        {indicatorIcon(isNotesExpanded)}
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
              <div className="hidden lg:flex flex-col self-start gap-3 border-2 border-green-500">
                <PlannerActions />
                <GraduationProgressCard
                  totalCredits={totalCredits}
                  geSatisfied={geSatisfied}
                  courseState={courseState}
                />
              </div>
              <Transition.Root show={isRightSidebarExpanded} as={Fragment}>
                <Dialog
                  as="div"
                  className="z-10"
                  onClose={setIsRightSidebarExpanded}
                >
                  <div className="fixed inset-0" />

                  <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <Transition.Child
                          as={Fragment}
                          enter="transform transition ease-in-out duration-500 sm:duration-700"
                          enterFrom="translate-x-full"
                          enterTo="translate-x-0"
                          leave="transform transition ease-in-out duration-500 sm:duration-700"
                          leaveFrom="translate-x-0"
                          leaveTo="translate-x-full"
                        >
                          <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                            <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl mt-14">
                              <div className="px-4 sm:px-6">
                                <div className="flex items-start justify-between">
                                  <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                    Panel title
                                  </Dialog.Title>
                                  <div className="ml-3 flex h-7 items-center">
                                    <button
                                      type="button"
                                      className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                      onClick={() =>
                                        setIsRightSidebarExpanded(false)
                                      }
                                    >
                                      <span className="absolute -inset-2.5" />
                                      <span className="sr-only">
                                        Close panel
                                      </span>
                                      <Close
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex relative mt-6 flex-1 px-4 sm:px-6 flex-col self-start gap-3 items-stretch w-full bg-bg-light py-4">
                                <PlannerActions />
                                <GraduationProgressCard
                                  totalCredits={totalCredits}
                                  geSatisfied={geSatisfied}
                                  courseState={courseState}
                                />
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            </div>
            <Modals />
          </CourseInfoProvider>
        </PermissionsProvider>
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
      <div className="flex flex-col gap-2 w-80">
        <Card className="h-20" />
        <Card className="h-[67vh]" />
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
