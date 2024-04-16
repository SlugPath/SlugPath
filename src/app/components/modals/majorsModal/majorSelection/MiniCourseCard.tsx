import { Term } from "@/app/types/Quarter";
import { courseTitle, isCustomCourse } from "@/lib/plannerUtils";
import useModalsStore from "@/store/modal";
import { StoredCourse } from "@customTypes/Course";
import { Card, Link } from "@mui/joy";

export function MiniCourseCard({
  course,
  quarterTitle,
}: {
  course: StoredCourse;
  quarterTitle?: string;
}) {
  // Zustand modal store
  const { setShowCourseInfoModal, setDisplayCourse, setDisplayTerm } =
    useModalsStore((state) => ({
      setShowCourseInfoModal: state.setShowCourseInfoModal,
      setDisplayCourse: state.setCourseInfoDisplayCourse,
      setDisplayTerm: state.setCourseInfoDisplayTerm,
    }));

  // Handlers
  const handleClickedCourse = () => {
    setShowCourseInfoModal(true);
    setDisplayCourse(course);
    setDisplayTerm(quarterTitle as Term);
  };

  return (
    <Card
      size="sm"
      color={isCustomCourse(course) ? "warning" : "primary"}
      sx={{
        p: 0.1,
        pl: 1,
      }}
      variant="soft"
      className="hover:opacity-50"
    >
      <Link
        overlay
        underline="none"
        sx={{ color: "text.tertiary" }}
        onClick={handleClickedCourse}
      >
        {courseTitle(course)}
      </Link>
    </Card>
  );
}
