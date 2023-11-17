import { getTitle } from "@/lib/courseUtils";
import { StoredCourse } from "../types/Course";
import { Modal, ModalClose, Sheet, Skeleton, Typography } from "@mui/joy";
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
          <Skeleton loading={loading} variant="text" width="50%">
            {title(data)}
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
