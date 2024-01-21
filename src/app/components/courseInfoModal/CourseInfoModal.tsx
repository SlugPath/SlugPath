import { getTitle, isCustomCourse } from "@/lib/plannerUtils";
import { Chip, Modal, ModalClose, Sheet, Skeleton, Tooltip } from "@mui/joy";
import { useQuery } from "@apollo/client";
import { GET_COURSE } from "@/graphql/queries";
import { ChangeEvent, useContext, useState } from "react";
import { ModalsContext } from "../../contexts/ModalsProvider";
import { StoredCourse } from "../../types/Course";
import { PlannerContext } from "../../contexts/PlannerProvider";
import { Label } from "../../types/Label";
import LabelsSelectionModal from "./LabelSelectionModal";
import CourseDetails from "./CourseDetails";
import CourseTitle from "./CourseInfoModalTitle";

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
  const [customTitle, setCustomTitle] = useState("");

  const handleEndEditing = () => {
    if (course && editing && customTitle.length > 0) {
      setEditing(false);
      course.title = customTitle;
      editCustomCourse(course.id, customTitle);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomTitle(value);
  };

  function title(data: any) {
    if (loading) return "";
    if (!data) return (course?.title ?? "").slice(0, MAX_MODAL_TITLE);
    const c = data.courseBy as StoredCourse;
    return `${c.departmentCode} ${c.number} ${getTitle(c)}`.slice(
      0,
      MAX_MODAL_TITLE,
    );
  }

  if (course === undefined) return null;

  const handleUpdateLabels = (labels: Label[]) => {
    const newLabels = labels.map((label) => label.id);
    const newCourse: StoredCourse = { ...course, labels: newLabels };
    const courseTerm = [newCourse, term];
    editCourseLabels(newCourse);
    updatePlannerLabels(labels);
    setDisplayCourse(courseTerm);
  };

  const labelsAreEditable = () => {
    if (course.labels) {
      return true;
    }
    return false;
  };

  return (
    <Modal
      open={showModal}
      onClose={() => {
        setShowModal(false);
        setCustomTitle("");
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
        {labelsAreEditable() && (
          <LabelsSelectionModal
            showModal={showLabelSelectionModal}
            setShowModal={setShowLabelSelectionModal}
            labels={getAllLabels()}
            selectedLabels={getCourseLabels(course)}
            onUpdateLabels={handleUpdateLabels}
          />
        )}
        <div className="flex flex-column justify-between items-center">
          <Skeleton loading={loading} variant="text" width="50%">
            <CourseTitle
              course={course}
              title={title(data)}
              term={term}
              editing={editing}
              setEditing={setEditing}
              customTitle={customTitle}
              handleTitleChange={handleTitleChange}
              handleEndEditing={handleEndEditing}
            />
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
          <CourseDetails
            course={course}
            data={data}
            loading={loading}
            setShowLabelSelectionModal={setShowLabelSelectionModal}
            getCourseLabels={getCourseLabels}
            labelsAreEditable={labelsAreEditable()}
            term={term}
          />
        </Skeleton>
        <ModalClose variant="plain" />
      </Sheet>
    </Modal>
  );
}
