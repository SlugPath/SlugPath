import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { PlannerData } from "../types/PlannerData";
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { StoredCourse } from "../types/Course";
import { findQuarter, Quarter } from "../types/Quarter";
import { getTitle } from "../../lib/courseUtils";
import { quartersPerYear } from "@/lib/initialPlanner";
import { ModalsContext } from "../contexts/ModalsProvider";
import { useContext } from "react";
import { PlannersContext } from "../contexts/PlannersProvider";

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
  titleView: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
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
  plannerTitle: {
    fontSize: 16,
    paddingLeft: 20,
    paddingBottom: 3,
    borderRadius: 10,
    margin: 3,
  },
  course: {
    marginTop: 4,
  },
  image: {
    margin: 10,
    marginRight: 25,
    height: 30,
    width: 30,
  },
});

export default function CourseSelectionModal() {
  const { setShowExportModal, showExportModal, courseState } =
    useContext(ModalsContext);

  const { activePlanner } = useContext(PlannersContext);

  return (
    <Modal
      open={showExportModal}
      onClose={() => setShowExportModal(false)}
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
          Export to PDF
        </Typography>
        <PDFViewer width="100%" height="90%">
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.titleView}>
                <Text style={styles.plannerTitle}>{activePlanner?.title}</Text>
                <Image style={styles.image} src="/images/slug-icon.png" />
              </View>
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
          .map((q) => q.id);

        return (
          <PDFQuarters key={i} quarters={quarters} courseState={courseState} />
        );
      })}
    </View>
  );
}

function PDFQuarters({
  key,
  quarters,
  courseState,
}: {
  quarters: string[];
  courseState: PlannerData;
  key: number;
}) {
  return (
    <View key={key} style={styles.yearView}>
      {quarters.map((q) => {
        const { quarter } = findQuarter(courseState.quarters, q);
        const courses = quarter.courses;
        return <PDFQuarter key={q} quarter={quarter} courses={courses} />;
      })}
    </View>
  );
}

function PDFQuarter({
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
