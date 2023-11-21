import { getTitle } from "@/lib/courseUtils";
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
import { useSession } from "next-auth/react";
import { useLabels } from "../hooks/useLabels";
import { IconButton } from "theme-ui";
import { Add } from "@mui/icons-material";
import LabelSelectionModal from "./modals/LabelSelectionModal";
import CourseLabel from "./CourseLabel";
import { PlannerContext } from "../contexts/PlannerProvider";
import { Label } from "../types/Label";

export default function CourseInfoModal() {
  const [showLabelSelectionModal, setShowLabelSelectionModal] = useState(false);
  const {
    setShowCourseInfoModal: setShowModal,
    showCourseInfoModal: showModal,
    displayCourse: course,
  } = useContext(ModalsContext);
  const { editCourse } = useContext(PlannerContext);
  const { data, error, loading } = useQuery(GET_COURSE, {
    variables: {
      department: course ? course.department : "",
      number: course ? course.number : "",
    },
    skip: !course,
  });
  const { data: session } = useSession();
  const { labels, loading: labelsLoading } = useLabels(session?.user.id);

  if (!course) return null;
  if (error) return `Error! ${error}`;

  function title(data: any) {
    return loading
      ? ""
      : getTitle(data.courseBy.department, data.courseBy.number) +
          " " +
          data.courseBy.name;
  }

  function credits(data: any) {
    return loading ? "" : data.courseBy.credits;
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
    editCourse(newCourse.number, newCourse.department, newCourse);
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
        <LabelSelectionModal
          showModal={showLabelSelectionModal}
          setShowModal={setShowLabelSelectionModal}
          labels={labels}
          selectedLabels={course.labels}
          onUpdateLabels={handleUpdateLabels}
        />
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
          <Skeleton loading={labelsLoading} variant="text" width="50%">
            <SelectedLabels
              labels={course.labels}
              onEditLabels={handleEditLabels}
            />
          </Skeleton>
        </Typography>
        <Skeleton loading={loading} variant="text" width="50%">
          <Typography component="p">
            Quarters offered: {quartersOffered(data)}
          </Typography>
          <Typography component="p">Credits: {credits(data)}</Typography>
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
    <div>
      <Typography component="p">Labels ;</Typography>
      <List orientation="horizontal">
        {labels.map((label) => (
          <ListItem key={label.id}>
            <CourseLabel label={label}>
              <div>{label.color}</div>
            </CourseLabel>
          </ListItem>
        ))}
        <IconButton aria-label="add label" onClick={onEditLabels}>
          <Add />
        </IconButton>
      </List>
    </div>
  );
}
