import { getTitle, isCSE, isCustomCourse, isOffered } from "@/lib/plannerUtils";
import {
  Grid,
  List,
  ListItem,
  Modal,
  ModalClose,
  Sheet,
  Skeleton,
  Typography,
} from "@mui/joy";
import { useQuery } from "@apollo/client";
import { GET_COURSE } from "@/graphql/queries";
import { ChangeEvent, useContext, useState } from "react";
import { ModalsContext } from "../contexts/ModalsProvider";
import { Add, Edit, WarningAmberRounded } from "@mui/icons-material";
import { StoredCourse } from "../types/Course";
import { PlannerContext } from "../contexts/PlannerProvider";
import { IconButton, Input } from "@mui/joy";
import LabelsSelectionModal from "./modals/LabelSelectionModal";
import { Label } from "../types/Label";
import CourseLabel from "./CourseLabel";

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

  const { data, loading } = useQuery(GET_COURSE, {
    variables: {
      departmentCode: course?.departmentCode,
      number: course?.number,
    },
    skip: course === undefined || isCustomCourse(course),
  });

  if (course === undefined) return null;

  function title(data: any) {
    if (loading) return "";
    if (!data) return (course?.title ?? "").slice(0, MAX_MODAL_TITLE);
    const c = data.courseBy as StoredCourse;
    return `${c.departmentCode} ${c.number} ${getTitle(c)}`.slice(
      0,
      MAX_MODAL_TITLE,
    );
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

  function quartersOffered(data: any) {
    if (loading) return "";
    if (!data) return "Quarters Offered: Summer, Fall, Winter, Spring";
    const c = data.courseBy as StoredCourse;
    if (c.quartersOffered.length == 0) return "Quarters Offered: None";
    return `Quarters Offered: ${c.quartersOffered.join(", ")}`;
  }

  const handleOpenLabels = () => {
    setShowLabelSelectionModal(true);
  };

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
        variant="outlined"
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
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          {/* Editable course title */}
          <Skeleton loading={loading} variant="text" width="50%">
            <Grid container alignItems="center" spacing="1">
              <Grid>
                {editing ? (
                  <Input
                    variant="soft"
                    autoFocus
                    value={customTitle}
                    size="lg"
                    placeholder={course.title}
                    onChange={handleTitleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEndEditing();
                    }}
                    onBlur={handleEndEditing}
                  />
                ) : (
                  title(data)
                )}
              </Grid>
              <Grid>
                {isCustomCourse(course) && term !== undefined && (
                  <IconButton
                    onClick={() => {
                      if (editing) {
                        handleEndEditing();
                      } else {
                        setEditing(true);
                      }
                    }}
                  >
                    <Edit />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Skeleton>
        </Typography>
        {/* End title */}
        {/* Course details */}
        <Skeleton loading={loading} variant="text" width="50%">
          <div className="space-y-2">
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
            {labelsAreEditable() && (
              <SelectedLabels
                labels={getCourseLabels(course)}
                handleOpenLabels={handleOpenLabels}
              />
            )}
          </div>
        </Skeleton>
        {/* End course details */}
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}

function SelectedLabels({
  labels,
  handleOpenLabels,
}: {
  labels: Label[];
  handleOpenLabels: () => void;
}) {
  return (
    // align items left
    <div className="flex flex-row items-center justify-start">
      <Typography>Labels:</Typography>
      <List orientation="horizontal">
        {labels.map((label) => (
          <ListItem key={label.id}>
            <CourseLabel
              label={label}
              displayText={label.name.length > 0}
              inMenu
            />
          </ListItem>
        ))}
        <IconButton onClick={handleOpenLabels} variant="solid">
          <Add />
        </IconButton>
      </List>
    </div>
  );
}
