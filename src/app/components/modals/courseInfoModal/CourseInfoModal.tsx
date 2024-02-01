import { courseInfo } from "@/app/actions/course";
import { getTitle, isCSE, isCustomCourse, isOffered } from "@/lib/plannerUtils";
import { ModalsContext } from "@contexts/ModalsProvider";
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
import SelectedLabels from "./SelectedLabels";

const MAX_MODAL_TITLE = 50;

export default function CourseInfoModal() {
  const [showLabelSelectionModal, setShowLabelSelectionModal] = useState(false);
  const {
    setShowCourseInfoModal: setShowModal,
    showCourseInfoModal: showModal,
  } = useContext(ModalsContext);

  const {
    editCustomCourse,
    getCourseLabels,
    getAllLabels,
    editCourseLabels,
    updatePlannerLabels,
  } = useContext(PlannerContext);

  const [editing, setEditing] = useState(false);
  const { displayCourse: courseTerm, setDisplayCourse } =
    useContext(PlannerContext);
  const [course = undefined, term = undefined] = courseTerm ?? [];

  const { data, isLoading: loading } = useQuery({
    queryKey: ["course", course?.departmentCode, course?.number],
    queryFn: async () => {
      // Don't fetch if the course is undefined or a custom course
      const res = await courseInfo({
        departmentCode: course!.departmentCode,
        number: course!.number,
      });
      return res;
    },
    enabled: course && !isCustomCourse(course),
  });

  // This is to prevent illegally opening the modal
  if (course === undefined || course.departmentCode === undefined) {
    return null;
  }

  // Accessors
  function title(c: StoredCourse | undefined) {
    if (loading) return "";
    if (!c) return (course?.title ?? "").slice(0, MAX_MODAL_TITLE);
    return `${c.departmentCode} ${c.number} ${getTitle(c)}`.slice(
      0,
      MAX_MODAL_TITLE,
    );
  }

  function description(c: StoredCourse | undefined) {
    // If it is a custom course with a description, display it
    if (course && isCustomCourse(course)) {
      return `Description: ${course.description}`;
    }
    if (loading || !c) return "";
    return `${c.description}`;
  }

  function quartersOffered(c: StoredCourse | undefined) {
    if (loading) return "";
    if (!c) return `Quarters Offered: ${course?.quartersOffered.join(", ")}`;
    if (c.quartersOffered.length == 0) return "Quarters Offered: None";
    return `Quarters Offered: ${c.quartersOffered.join(", ")}`;
  }

  function credits(c: StoredCourse | undefined) {
    if (loading) return "";
    if (!c) return course?.credits;
    return c.credits;
  }

  function ge(c: StoredCourse | undefined) {
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

  function prerequisites(c: StoredCourse | undefined) {
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
    editCourseLabels(newCourse);
    updatePlannerLabels(labels);
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
          <Skeleton loading={loading} variant="text" width="50%">
            {!isCSE(course) && !isCustomCourse(course) && (
              <Typography
                variant="soft"
                color="warning"
                component="p"
                startDecorator={<WarningAmberRounded color="warning" />}
              >
                Warning: quarters offered information is unavailable for this
                course.
              </Typography>
            )}
            {isCSE(course) && !isOffered(course.quartersOffered, term) && (
              <Typography
                variant="soft"
                color="warning"
                component="p"
                startDecorator={<WarningAmberRounded color="warning" />}
              >
                Warning: {course.departmentCode} {course.number} is not offered
                in {` ${term}`}
              </Typography>
            )}
            <Typography component="p">{quartersOffered(data)}</Typography>
            <Typography component="p">Credits: {credits(data)}</Typography>
            {data !== undefined && (
              <>
                <Typography component="p">{prerequisites(data)}</Typography>
                <Typography component="p">GE: {ge(data)}</Typography>
              </>
            )}
            {course.labels && (
              <SelectedLabels
                labels={getCourseLabels(course)}
                handleOpenLabels={handleOpenLabels}
                ge={course.ge}
              />
            )}
          </Skeleton>
          <ModalClose variant="plain" />
          {customCourseInPlanner && (
            <Button onClick={() => setEditing(true)} className="w-full">
              <Typography
                level="body-lg"
                sx={{
                  color: "white",
                }}
              >
                Edit
              </Typography>
            </Button>
          )}
        </div>
      </Sheet>
    </Modal>
  );
}
