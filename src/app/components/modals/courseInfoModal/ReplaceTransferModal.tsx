import { StoredCourse } from "@/app/types/Course";
import { useTransferCourses } from "@hooks/reactQuery";

export default function ReplaceTransferModal({
  course,
}: {
  course: StoredCourse;
}) {
  const { data } = useTransferCourses(course);
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {data?.map((t) => (
        <p key={t.id}>
          {" "}
          {t.title} @ {t.school}{" "}
        </p>
      ))}
    </div>
  );
}
