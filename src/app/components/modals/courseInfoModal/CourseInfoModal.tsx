import {
  getTitle,
  isCustomCourse,
  isOffered,
  isOfficialCourse,
  isTransferCourse,
} from "@/lib/plannerUtils";
import { truncateTitle } from "@/lib/utils";
import { CourseInfoContext } from "@contexts/CourseInfoProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
import { useCourse, usePastEnrollmentInfo } from "@hooks/reactQuery";
import { WarningAmberRounded } from "@mui/icons-material";
import {
  Button,
  Chip,
  Modal,
  ModalClose,
  Sheet,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useContext, useState } from "react";

import CustomCourseModal from "./CustomCourseModal";
import LabelsSelectionModal from "./LabelSelectionModal";
import MoreEnrollInfo from "./MoreEnrollInfo";
import QuartersOfferedTable from "./QuartersOfferedTable";
import ReplaceCourseModal from "./ReplaceCourseModal";
import SelectedLabels from "./SelectedLabels";

const MAX_MODAL_TITLE = 60;

export default function CourseInfoModal({
  viewOnly = false,
}: {
  viewOnly?: boolean;
}) {
  const [showLabelSelectionModal, setShowLabelSelectionModal] = useState(false);
  const {
    setShowCourseInfoModal: setShowModal,
    showCourseInfoModal: showModal,
    displayCourse: courseTerm,
    setDisplayCourse,
  } = useContext(CourseInfoContext);

  const {
    editCustomCourse,
    getCourseLabels,
    getAllLabels,
    updatePlannerLabels,
  } = useContext(PlannerContext);

  const [editing, setEditing] = useState(false);
  const [replacing, setReplacing] = useState(false);

  const [course = undefined, term = undefined] = courseTerm ?? [];

  const { data, isLoading: loading } = useCourse(
    course?.departmentCode ?? "",
    course?.number ?? "",
  );
  const { data: enrollmentInfo, isLoading: enrollLoading } =
    usePastEnrollmentInfo(course);

  // This is to prevent illegally opening the modal
  if (course === undefined || course.departmentCode === undefined) {
    return null;
  }

  // ============= Begin Accessor Functions =============
  function title(c?: StoredCourse) {
    if (loading) return "";
    if (!c) {
      if (isCustomCourse(course!))
        return (course?.title ?? "").slice(0, MAX_MODAL_TITLE);
      // For transfer courses
      return truncateTitle(
        `${course?.departmentCode} ${course?.number} ${getTitle(course!)}`,
        MAX_MODAL_TITLE,
      );
    }
    return truncateTitle(
      `${c?.departmentCode} ${c?.number} ${getTitle(c!)}`,
      MAX_MODAL_TITLE,
    );
  }

  function description(c?: StoredCourse) {
    // If it is a custom course with a description, display it
    if (course && isCustomCourse(course)) {
      return `Description: ${course.description}`;
    }
    if (loading || !c) return "";
    return `${c.description}`;
  }

  function credits(c?: StoredCourse) {
    if (loading) return "";
    if (!c) return course?.credits;
    return c.credits;
  }

  function ge(c?: StoredCourse) {
    if (loading || !c) return "";
    const capitalize: { [key: string]: string } = {
      peT: "PE-T",
      peH: "PE-H",
      peE: "PE-E",
      prC: "PR-C",
      prS: "PR-S",
      prE: "PR-E",
    };
    return c.ge.map((code: string) => {
      if (code === "None") return code;
      if (Object.keys(capitalize).includes(code)) return capitalize[code];
      return code.toLocaleUpperCase();
    });
  }

  function prerequisites(c?: StoredCourse) {
    const start = "Prerequisite(s):";
    if (loading || !c || !c.prerequisites) return `${start} None`;
    const preqs: string = c.prerequisites;
    return preqs.includes(start) ? preqs : `${start} ${preqs}`;
  }

  // ============= End Accessor Functions =============

  // ============= Begin Handler Functions =============
  const handleOpenLabels = () => {
    setShowLabelSelectionModal(true);
  };

  const handleUpdateLabels = (labels: Label[]) => {
    const newLabels = labels.map((label) => label.id);
    const newCourse: StoredCourse = { ...course, labels: newLabels };
    updatePlannerLabels({
      labels,
      newCourse,
    });
    setDisplayCourse([newCourse, term]);
  };

  // ============= End Handler Functions =============

  // Only show this second modal if it is a custom/official course,
  // in the planner, and the course is being edited
  const courseInPlanner = !isTransferCourse(course) && term !== undefined;
  const customCourseInPlanner = isCustomCourse(course) && term !== undefined;

  if (editing && customCourseInPlanner) {
    const handleClose = () => {
      setEditing(false);
    };

    const handleSave = (crs: StoredCourse) => {
      editCustomCourse(crs);
      setDisplayCourse([crs, term]);
      handleClose();
    };

    return (
      <CustomCourseModal
        onSave={handleSave}
        onClose={handleClose}
        defaultCourse={course}
        isOpen={editing}
      />
    );
  }

  // Only show this modal if it is a custom course,
  // in the planner, and the course is being replaced
  if (replacing && courseInPlanner) {
    return (
      <ReplaceCourseModal
        onSave={() => {
          setReplacing(false);
          setShowModal(false);
        }}
        onClose={() => setReplacing(false)}
        isOpen={replacing}
        toReplace={course}
        isTransfer={isOfficialCourse(course)}
      />
    );
  }

  return (
    <Modal
      open={showModal}
      onClose={() => {
        setShowModal(false);
        setEditing(false);
      }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sheet
        sx={{
          width: "50%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <div className="flex flex-col gap-2">
          {course.labels && (
            <LabelsSelectionModal
              showModal={showLabelSelectionModal}
              setShowModal={setShowLabelSelectionModal}
              labels={getAllLabels()}
              selectedLabels={getCourseLabels(course)}
              onUpdateLabels={handleUpdateLabels}
            />
          )}
          <div className="flex justify-between items-center">
            <Skeleton loading={loading} variant="text" width="50%">
              <h2 className="text-xl font-bold">{title(data)}</h2>
            </Skeleton>
            {isCustomCourse(course) ? (
              <Tooltip title="We recommend replacing this custom course with a real course.">
                <Chip color="custom" size="lg" className="mr-2">
                  Custom Course
                </Chip>
              </Tooltip>
            ) : isOfficialCourse(course) ? (
              <Chip color="primary" size="lg" className="mr-2">
                Official Course
              </Chip>
            ) : (
              <Chip color="transfer" size="lg" className="mr-2">
                Transfer Course
              </Chip>
            )}
          </div>
          <Skeleton loading={loading} variant="text" width="50%">
            <Typography
              className="text-wrap"
              level="body-md"
              sx={{
                inlineSize: "100%",
                overflowWrap: "break-word",
                maxHeight: "12rem",
                overflowY: "auto",
              }}
            >
              {description(data)}
            </Typography>
          </Skeleton>
          {/* Show preqs, ge, past enrollment info, and instructors for official courses*/}
          <p>Credits: {credits(data)}</p>
          {isOfficialCourse(course) ? (
            <>
              <p>{prerequisites(data)}</p>
              <p>GE: {ge(data)}</p>
              <Skeleton loading={enrollLoading}>
                {enrollmentInfo && enrollmentInfo.length > 0 && (
                  <QuartersOfferedTable enrollmentInfo={enrollmentInfo} />
                )}
              </Skeleton>
              <MoreEnrollInfo course={course} />
            </>
          ) : isCustomCourse(course) ? (
            <>
              <div className="flex flex-row gap-2 items-center">
                <p>Quarters Offered:</p>
                {course.quartersOffered.map((quarter, i) => (
                  <Chip key={i} color="primary">
                    {quarter}
                  </Chip>
                ))}
              </div>
              {!isOffered(course.quartersOffered, term) && (
                <Typography
                  color="warning"
                  component="p"
                  startDecorator={<WarningAmberRounded color="warning" />}
                >
                  Warning: {course.title} is not offered in {` ${term}`} Quarter
                </Typography>
              )}
            </>
          ) : (
            <p className="text-lg">School: {course.school}</p>
          )}
          {!viewOnly && (
            <SelectedLabels
              labels={getCourseLabels(course)}
              handleOpenLabels={handleOpenLabels}
              ge={course.ge}
            />
          )}
          <ModalClose variant="plain" />
          {!viewOnly && courseInPlanner && (
            <div className="flex gap-2 justify-center">
              {isCustomCourse(course) && (
                <Button onClick={() => setEditing(true)} className="w-1/2">
                  <p className="text-white text-lg">Edit</p>
                </Button>
              )}

              <Button
                onClick={() => setReplacing(true)}
                className="w-1/2"
                color="success"
              >
                <p className="text-white text-lg">Replace</p>
              </Button>
            </div>
          )}
        </div>
      </Sheet>
    </Modal>
  );
}
