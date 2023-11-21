import { getTitle, isOffered } from "@/lib/courseUtils";
import { Modal, ModalClose, Sheet, Skeleton, Typography } from "@mui/joy";
import { useQuery } from "@apollo/client";
import { GET_COURSE } from "@/graphql/queries";
import { createQuartersOfferedString } from "@/lib/courseUtils";
import { useContext } from "react";
import { ModalsContext } from "../contexts/ModalsProvider";
import { WarningAmberRounded } from "@mui/icons-material";

export default function CourseInfoModal() {
  const {
    setShowCourseInfoModal: setShowModal,
    showCourseInfoModal: showModal,
    displayCourse: courseTerm,
  } = useContext(ModalsContext);

  const [course = undefined, term = undefined] = courseTerm ?? [];
  const { data, error, loading } = useQuery(GET_COURSE, {
    variables: {
      departmentCode: course?.departmentCode,
      number: course?.number,
    },
    skip: course === undefined,
  });

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
          {!isOffered(course.quartersOffered, term) && (
            <Typography
              variant="soft"
              color="warning"
              component="p"
              startDecorator={<WarningAmberRounded color="warning" />}
            >
              Warning: {course.departmentCode} {course.number} is not offered in{" "}
              {term}
            </Typography>
          )}
          <Typography component="p">
            Quarters offered: {quartersOffered(data)}
          </Typography>
          <Typography component="p">Credits: {credits(data)}</Typography>
          <Typography component="p">{prerequisites(data)}</Typography>
          <Typography component="p">GE: {ge(data)}</Typography>
        </Skeleton>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}
