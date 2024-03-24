import { StoredCourse } from "@/app/types/Course";
import SearchResults from "@components/search/SearchResults";
import { useTransferCourses } from "@hooks/reactQuery";

export default function ReplaceTransferModal({
  course,
}: {
  course: StoredCourse;
}) {
  const { data: courses, isPending: loading } = useTransferCourses(course);
  return (
    <div className="h-36">
      <p className="text-lg font-bold">Transfer Alternatives</p>
      <SearchResults
        courses={courses ?? []}
        loading={loading}
        droppableId="transfer-search"
      />
    </div>
  );
}
