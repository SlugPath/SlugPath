import { getTitle } from "@/lib/courseUtils";
import { Modal, ModalClose, Sheet, Skeleton, Typography } from "@mui/joy";
import { useQuery } from "@apollo/client";
import { GET_COURSE } from "@/graphql/queries";
import { createQuartersOfferedString } from "@/lib/courseUtils";
import { useContext } from "react";
import { ModalsContext } from "../contexts/ModalsProvider";
import { useSession } from "next-auth/react";
import { useLabels } from "../hooks/useLabels";
import { Label } from "@prisma/client";

export default function CourseInfoModal() {
  const {
    setShowCourseInfoModal: setShowModal,
    showCourseInfoModal: showModal,
    displayCourse: course,
  } = useContext(ModalsContext);
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

  // console.log(labels);
  // console.log(labelsLoading);

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
          <Skeleton loading={labelsLoading} variant="text" width="50%">
            {labels.map((label: Label) => {
              return (
                <div
                  key={label.id}
                  // className="bg-gray-200 text-gray-600 text-xs font-semibold rounded-full px-2 py-1 mr-1"
                >
                  {label.color}
                </div>
              );
            })}
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
