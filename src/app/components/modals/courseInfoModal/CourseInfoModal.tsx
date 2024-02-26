import { getEnrollmentInfo } from "@/app/actions/enrollment";
import { getTitle, isCSE, isCustomCourse, isOffered } from "@/lib/plannerUtils";
import { truncateTitle } from "@/lib/utils";
import { courseInfo } from "@actions/course";
import { CourseInfoContext } from "@contexts/CourseInfoProvider";
import { PlannerContext } from "@contexts/PlannerProvider";
import { StoredCourse } from "@customTypes/Course";
import { Label } from "@customTypes/Label";
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
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";

import CustomCourseModal from "./CustomCourseModal";
import LabelsSelectionModal from "./LabelSelectionModal";
import MoreEnrollInfo from "./MoreEnrollInfo";
import ReplaceCustomModal from "./ReplaceCustomModal";
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

  const { data, isLoading: loading } = useQuery({
    queryKey: ["course", course?.departmentCode, course?.number],
    queryFn: async () =>
      await courseInfo({
        departmentCode: course!.departmentCode,
        number: course!.number,
      }),
    enabled: course && !isCustomCourse(course),
  });

  const { data: enrollmentInfo, isLoading: enrollLoading } = useQuery({
    queryKey: ["pastEnrollmentInfo", course?.departmentCode, course?.number],
    queryFn: async () => await getEnrollmentInfo(course!),
    enabled: course !== undefined && !isCustomCourse(course),
    initialData: [],
  });

  // This is to prevent illegally opening the modal
  if (course === undefined || course.departmentCode === undefined) {
    return null;
  }

  // Accessors
  function title(c?: StoredCourse) {
    if (loading) return "";
    if (!c) return (course?.title ?? "").slice(0, MAX_MODAL_TITLE);
    return truncateTitle(
      `${c.departmentCode} ${c.number} ${getTitle(c)}`,
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

  // Handlers
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

  const handleClose = (crs: StoredCourse) => {
    editCustomCourse(crs);
    setDisplayCourse([crs, term]);
    setEditing(false);
  };

  // Only show this second modal if it is a custom course,
  // in the planner, and the course is being edited
  const customCourseInPlanner = isCustomCourse(course) && term !== undefined;
  if (editing && customCourseInPlanner) {
    return (
      <CustomCourseModal
        onClose={handleClose}
        defaultCourse={course}
        isOpen={editing}
      />
    );
  }

  // Only show this modal if it is a custom course,
  // in the planner, and the course is being replaced
  if (replacing && customCourseInPlanner) {
    return (
      <ReplaceCustomModal
        onSave={() => {
          setReplacing(false);
          setShowModal(false);
        }}
        onClose={() => setReplacing(false)}
        isOpen={replacing}
        customCourse={course}
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
              <Typography
                component="h2"
                id="modal-title"
                level="h4"
                textColor="inherit"
                fontWeight="lg"
              >
                {title(data)}
              </Typography>
            </Skeleton>
            {isCustomCourse(course) ? (
              <Tooltip title="We recommend replacing this custom course with a real course.">
                <Chip color="warning" size="lg" className="mr-2">
                  Custom Course
                </Chip>
              </Tooltip>
            ) : (
              <Chip color="primary" size="lg" className="mr-2">
                Official Course
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
          {!isCustomCourse(course) ? (
            <>
              <Typography component="p">{prerequisites(data)}</Typography>
              <Typography component="p">GE: {ge(data)}</Typography>
              <Skeleton loading={enrollLoading} variant="text" width="50%">
                <div className="flex flex-wrap items-center gap-2">
                  <Typography component="p">Quarters Offered:</Typography>
                  {enrollmentInfo.map((e, i) => {
                    let color: "warning" | "primary" | "success" | "danger";
                    switch (e.term.title) {
                      case "Fall":
                        color = "warning";
                        break;
                      case "Winter":
                        color = "primary";
                        break;
                      case "Spring":
                        color = "success";
                        break;
                      default:
                        color = "danger";
                    }
                    return (
                      <Chip key={i} color={color}>
                        {e.term.title} {e.term.catalogYear}, {e.instructor}
                      </Chip>
                    );
                  })}
                </div>
                {isCSE(course) && !isOffered(course.quartersOffered, term) && (
                  <Typography
                    color="warning"
                    component="p"
                    startDecorator={<WarningAmberRounded color="warning" />}
                  >
                    Warning: {course.departmentCode} {course.number} is not
                    offered in {` ${term}`} Quarter
                  </Typography>
                )}
              </Skeleton>
            </>
          ) : (
            <div className="flex flex-row gap-2 items-center">
              <Typography component="p">Quarters Offered:</Typography>
              {course.quartersOffered.map((q, i) => (
                <Chip key={i} color="primary">
                  {q}
                </Chip>
              ))}
            </div>
          )}
          <Typography component="p">Credits: {credits(data)}</Typography>
          <MoreEnrollInfo course={course} />
          {!viewOnly && course.labels && (
            <SelectedLabels
              labels={getCourseLabels(course)}
              handleOpenLabels={handleOpenLabels}
              ge={course.ge}
            />
          )}
          <ModalClose variant="plain" />
          {!viewOnly && customCourseInPlanner && (
            <div className="flex gap-2">
              <Button onClick={() => setEditing(true)} className="w-1/2">
                <Typography
                  level="body-lg"
                  sx={{
                    color: "white",
                  }}
                >
                  Edit
                </Typography>
              </Button>
              <Button
                onClick={() => setReplacing(true)}
                className="w-1/2"
                color="success"
              >
                <Typography
                  level="body-lg"
                  sx={{
                    color: "white",
                  }}
                >
                  Replace
                </Typography>
              </Button>
            </div>
          )}
        </div>
      </Sheet>
    </Modal>
  );
}
