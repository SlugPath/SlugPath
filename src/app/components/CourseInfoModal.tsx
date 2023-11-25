import { getTitle, isOffered } from "@/lib/courseUtils";
import {
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
import { createQuartersOfferedString } from "@/lib/courseUtils";
import { useContext, useState } from "react";
import { ModalsContext } from "../contexts/ModalsProvider";
import { WarningAmberRounded } from "@mui/icons-material";
import { IconButton } from "theme-ui";
import { Add } from "@mui/icons-material";
import LabelSelectionModal from "./modals/LabelSelectionModal";
import CourseLabel from "./CourseLabel";
import { PlannerContext } from "../contexts/PlannerProvider";
import { Label } from "../types/Label";
import { LabelsContext } from "../contexts/LabelsProvider";

export default function CourseInfoModal() {
  const [showLabelSelectionModal, setShowLabelSelectionModal] = useState(false);
  const {
    setShowCourseInfoModal: setShowModal,
    showCourseInfoModal: showModal,
  } = useContext(ModalsContext);

  const { displayCourse: courseTerm, setDisplayCourse } =
    useContext(PlannerContext);
  const [course = undefined, term = undefined] = courseTerm ?? [];
  const { editCourse } = useContext(PlannerContext);
  const { data, error, loading } = useQuery(GET_COURSE, {
    variables: {
      departmentCode: course?.departmentCode,
      number: course?.number,
    },
    skip: course === undefined,
  });
  const { labels, updateLabels } = useContext(LabelsContext);

  if (error) return `Error! ${error}`;
  if (course === undefined) return null;

  function title(data: any) {
    return loading
      ? ""
      : getTitle(data.courseBy.departmentCode, data.courseBy.number) +
          " " +
          data.courseBy.title;
  }

  function credits(data: any) {
    return loading ? "" : data.courseBy.credits;
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
    return loading ? "" : createQuartersOfferedString(data.courseBy);
  }

  const handleEditLabels = () => {
    setShowLabelSelectionModal(true);
  };

  const handleUpdateLabels = (labels: Label[]) => {
    const newLabels = labels.map((label) => {
      return {
        id: label.id,
        name: label.name,
        color: label.color,
      };
    });
    const newCourse = { ...course, labels: newLabels };
    const courseTerm = [newCourse, term];
    editCourse(newCourse.number, newCourse.departmentCode, newCourse);
    setDisplayCourse(courseTerm);
    updateLabels(newLabels);
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
      onClose={() => setShowModal(false)}
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
          <LabelSelectionModal
            showModal={showLabelSelectionModal}
            setShowModal={setShowLabelSelectionModal}
            labels={labels}
            selectedLabels={course.labels}
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
          <Skeleton loading={loading} variant="text" width="50%">
            {title(data)}
          </Skeleton>
        </Typography>
        <Skeleton loading={loading} variant="text" width="50%">
          <div className="space-y-2">
            {!isOffered(course.quartersOffered, term) && (
              <Typography
                variant="soft"
                color="warning"
                component="p"
                startDecorator={<WarningAmberRounded color="warning" />}
              >
                Warning: {course.departmentCode} {course.number} is not offered
                in {term}
              </Typography>
            )}
            <Typography component="p">
              Quarters offered: {quartersOffered(data)}
            </Typography>
            <Typography component="p">Credits: {credits(data)}</Typography>
            <Typography component="p">{prerequisites(data)}</Typography>
            <Typography component="p">GE: {ge(data)}</Typography>
            {labelsAreEditable() && (
              <SelectedLabels
                labels={course.labels}
                onEditLabels={handleEditLabels}
              />
            )}
          </div>
        </Skeleton>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}

function SelectedLabels({
  labels,
  onEditLabels,
}: {
  labels: Label[];
  onEditLabels: () => void;
}) {
  return (
    // align items left
    <div className="flex flex-row items-center justify-start">
      <Typography>Labels:</Typography>
      <List orientation="horizontal">
        {labels.map((label) => (
          <ListItem key={label.id}>
            <CourseLabel label={label} displayText={label.name.length > 0} />
          </ListItem>
        ))}
        <IconButton onClick={onEditLabels} variant="solid">
          <Add />
        </IconButton>
      </List>
    </div>
  );
}
