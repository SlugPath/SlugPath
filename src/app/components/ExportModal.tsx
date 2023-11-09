import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { PlannerData } from "../ts-types/PlannerData";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { StoredCourse } from "../ts-types/Course";
import { Quarter, findQuarter } from "../ts-types/Quarter";
import { getTitle } from "../../lib/courseUtils";
import { quartersPerYear } from "@/lib/initialPlanner";

// Create styles
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
  },
  quarterTitle: {
    fontSize: 10,
    textAlign: "left",
  },
  page: {
    marginTop: 16,
    alignContent: "center",
  },
  yearView: {
    flexDirection: "row",
    marginHorizontal: 16,
    flexGrow: 1,
  },
  quarterCard: {
    fontSize: 8,
    padding: 10,
    margin: 3,
    width: 150,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    borderColor: "#D1D5DB",
    borderWidth: 1,
  },
  course: {
    marginTop: 4,
  },
});

export default function CourseSelectionModal({
  courseState,
  setShowModal,
  showModal,
}: {
  courseState: PlannerData;
  setShowModal: any;
  showModal: boolean;
}) {
  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          height: "80%",
          width: "100%",
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
          Export Planner to PDF
        </Typography>
        <PDFViewer width="100%" height="90%">
          <Document>
            <Page size="A4" style={styles.page}>
              <View>
                <Years courseState={courseState} />
              </View>
            </Page>
          </Document>
        </PDFViewer>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}

function Years({ courseState }: { courseState: PlannerData }) {
  return (
    <View>
      {Array.from({ length: quartersPerYear }, (_, index) => index).map((i) => {
        const slice_val = quartersPerYear * i;
        const quarters = courseState.quarters
          .slice(slice_val, slice_val + quartersPerYear)
          .map((q) => q.title);

        return (
          <Quarters key={i} quarters={quarters} courseState={courseState} />
        );
      })}
    </View>
  );
}

function Quarters({
  quarters,
  courseState,
  key,
}: {
  quarters: string[];
  courseState: PlannerData;
  key: number;
}) {
  return (
    <View key={key} style={styles.yearView}>
      {quarters.map((quarterId) => {
        const { quarter } = findQuarter(courseState.quarters, quarterId);
        const courses = quarter.courses;
        return <Quarter key={quarterId} quarter={quarter} courses={courses} />;
      })}
    </View>
  );
}

function Quarter({
  quarter,
  courses,
}: {
  quarter: Quarter;
  courses: StoredCourse[];
}) {
  return (
    <View style={styles.quarterCard}>
      <Text style={styles.quarterTitle}>{quarter.title}</Text>
      <View>
        {courses.map((course, idx) => {
          return (
            <View key={idx} style={styles.course}>
              <Text>{getTitle(course.department, course.number)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
