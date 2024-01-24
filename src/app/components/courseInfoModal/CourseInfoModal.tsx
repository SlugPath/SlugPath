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
import CourseDescription from "./CourseInfoModalDescription";

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
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);

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
  const [customDescription, setCustomDescription] = useState("");

  // Handlers
  const handleEndEditingTitle = () => {
    if (course && editingTitle && customTitle.length > 0) {
      setEditingTitle(false);
      course.title = customTitle;
      editCustomCourse(course.id, customTitle, course.description);
    }
  };

  const handleEndEditingDesc = () => {
    if (course && editingDesc && customDescription.length > 0) {
      setEditingDesc(false);
      course.description = customDescription;
      editCustomCourse(course.id, course.title, customDescription);
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomTitle(e.target.value);
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomDescription(e.target.value);
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

  function description(data: any) {
    // If it is a custom course with a description, display it
    if (loading) return "";
    if (course && isCustomCourse(course)) {
      return `Description: ${course.description}`;
    }
    return `${data.courseBy.description}`;
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
        setEditingTitle(false);
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
              editing={editingTitle}
              setEditing={setEditingTitle}
              customTitle={customTitle}
              handleTitleChange={handleTitleChange}
              handleEndEditing={handleEndEditingTitle}
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
          <CourseDescription
            course={course}
            description={description(data)}
            term={term}
            editing={editingDesc}
            setEditing={setEditingDesc}
            customDescription={customDescription}
            handleDescriptionChange={handleDescriptionChange}
            handleEndEditing={handleEndEditingDesc}
          />
        </Skeleton>
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
