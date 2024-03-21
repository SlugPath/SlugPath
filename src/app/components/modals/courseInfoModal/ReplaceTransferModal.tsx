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
      Foo:
      {data?.map((inst: any) => <p key={inst.id}> {inst.name} </p>)}
    </div>
  );
}
