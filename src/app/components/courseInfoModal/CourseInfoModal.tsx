import { getTitle, isCSE, isCustomCourse, isOffered } from "@/lib/plannerUtils";
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
import { useQuery } from "@apollo/client";
import { GET_COURSE } from "@/graphql/queries";
import { useContext, useState } from "react";
import { ModalsContext } from "../../contexts/ModalsProvider";
import { StoredCourse } from "../../types/Course";
import { PlannerContext } from "../../contexts/PlannerProvider";
import { Label } from "../../types/Label";
import LabelsSelectionModal from "./LabelSelectionModal";
import { WarningAmberRounded } from "@mui/icons-material";
import CustomCourseModal from "./CustomCourseModal";
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
  const { data, loading } = useQuery(GET_COURSE, {
    variables: {
      departmentCode: course?.departmentCode,
      number: course?.number,
    },
    skip: course === undefined || isCustomCourse(course),
  });

  // This is to prevent accidentally opening the modal when it shouldn't be
  if (course === undefined || course.departmentCode === undefined) {
    return null;
  }

  // Accessors
  function title(data: any) {
    if (loading) return "";
    if (!data) return (course?.title ?? "").slice(0, MAX_MODAL_TITLE);
    const c = data.courseBy as StoredCourse;
    return `${c.departmentCode} ${c.number} ${getTitle(c)}`.slice(
      0,
      MAX_MODAL_TITLE,
    );
  }

  function description(data: any) {
    // If it is a custom course with a description, display it
    if (loading) return "";
    if (course && isCustomCourse(course)) {
      return `Description: ${course.description}`;
    }
    console.log(`deptCode: ${course?.title}`);
    console.log(`description: ${data.courseBy.description}`);
    return `${data.courseBy.description}`;
  }

  function quartersOffered(data: any) {
    if (loading) return "";
    if (!data) return `Quarters Offered: ${course?.quartersOffered.join(", ")}`;
    const c = data.courseBy as StoredCourse;
    if (c.quartersOffered.length == 0) return "Quarters Offered: None";
    return `Quarters Offered: ${c.quartersOffered.join(", ")}`;
  }

  function credits(data: any) {
    if (loading) return "";
    if (!data) return course?.credits;
    return data.courseBy.credits;
  }

  function ge(data: any) {
    if (loading) return "";
    const capitalize: { [key: string]: string } = {
      peT: "PE-T",
      peH: "PE-H",
      peE: "PE-E",
      prC: "PR-C",
      prS: "PR-S",
      prE: "PR-E",
    };
    return data.courseBy.ge.map((code: string) => {
      if (code === "None") return code;
      if (Object.keys(capitalize).includes(code)) return capitalize[code];
      return code.toLocaleUpperCase();
    });
  }

  function prerequisites(data: any) {
    const start = "Prerequisite(s):";
    if (loading) return `${start} None`;
    const preqs: string = data.courseBy.prerequisites;
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
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
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
        <div className="flex flex-col gap-4">
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
              <Typography level="title-md">{title(data)}</Typography>
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
            <Typography level="body-md">{description(data)}</Typography>
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
