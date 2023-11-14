import { getTitle } from "@/lib/courseUtils";
import { StoredCourse } from "../types/Course";
import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useQuery } from "@apollo/client";
import { GET_COURSE } from "@/graphql/queries";
import { createQuartersOfferedString } from "@/lib/courseUtils";

export default function CourseInfoModal({
  setShowModal,
  showModal,
  course,
}: {
  setShowModal: any;
  showModal: boolean;
  course?: StoredCourse;
}) {
  const { data, error, loading } = useQuery(GET_COURSE, {
    variables: {
      department: course ? course.department : "",
      number: course ? course.number : "",
    },
    skip: !course,
  });

  if (!course) return null;
  if (loading) return null;
  if (error) return `Error! ${error}`;

  const loadedCourse = data.courseBy;
  const title =
    getTitle(loadedCourse.department, loadedCourse.number) +
    " " +
    loadedCourse.name;

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
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
        >
          {title}
        </Typography>
        <Typography component="p">
          Quarters offered: {createQuartersOfferedString(loadedCourse)}
        </Typography>
        <Typography component="p">Credits: {loadedCourse.credits}</Typography>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}
