import { isCSE, isCustomCourse, isOffered } from "@/lib/plannerUtils";
import { Typography } from "@mui/joy";
import { WarningAmberRounded } from "@mui/icons-material";
import { StoredCourse } from "../../types/Course";
import { Label } from "../../types/Label";
import SelectedLabels from "./SelectedLabels";
import { Term } from "@/app/types/Quarter";

export default function CourseDetails({
  course,
  data,
  loading,
  setShowLabelSelectionModal,
  getCourseLabels,
  labelsAreEditable,
  term,
}: {
  course: StoredCourse;
  data: any;
  loading: boolean;
  setShowLabelSelectionModal: (show: boolean) => void;
  getCourseLabels: (course: StoredCourse) => Label[];
  labelsAreEditable: boolean;
  term?: Term | undefined;
}) {
  function quartersOffered(data: any) {
    if (loading) return "";
    if (!data) return "Quarters Offered: Summer, Fall, Winter, Spring";
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

  const handleOpenLabels = () => {
    setShowLabelSelectionModal(true);
  };

  return (
    <div className="space-y-2">
      {!isCSE(course) && !isCustomCourse(course) && (
        <Typography
          variant="soft"
          color="warning"
          component="p"
          startDecorator={<WarningAmberRounded color="warning" />}
        >
          Warning: quarters offered information is unavailable for this course.
        </Typography>
      )}
      {isCSE(course) && !isOffered(course.quartersOffered, term) && (
        <Typography
          variant="soft"
          color="warning"
          component="p"
          startDecorator={<WarningAmberRounded color="warning" />}
        >
          Warning: {course.departmentCode} {course.number} is not offered in{" "}
          {` ${term}`}
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
      {labelsAreEditable && (
        <SelectedLabels
          labels={getCourseLabels(course)}
          handleOpenLabels={handleOpenLabels}
          ge={course.ge}
        />
      )}
    </div>
  );
}
