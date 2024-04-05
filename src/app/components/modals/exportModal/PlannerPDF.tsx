import { courseTitle, isCustomCourse } from "@/lib/plannerUtils";
import { QUARTERS_PER_YEAR, findCoursesInQuarter } from "@/lib/plannerUtils";
import { constructQuarterId } from "@/lib/quarterUtils";
import { StoredCourse } from "@customTypes/Course";
import { PlannerData } from "@customTypes/Planner";
import { Quarter } from "@customTypes/Quarter";
import {
  Document,
  Image,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

export default function PlannerPDF({ planner }: { planner: PlannerData }) {
  return (
    <PDFViewer width="100%" height="90%">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.titleView}>
            <Text style={styles.plannerTitle}>{planner.title}</Text>

            {/* Image rendered as pdf, no need for alt text */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={styles.image} src="/images/slug-path-icon.png" />
          </View>
          <View>
            <Years planner={planner} />
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

function Years({ planner }: { planner: PlannerData }) {
  return (
    <View>
      {Array.from({ length: QUARTERS_PER_YEAR }, (_, index) => index).map(
        (i) => {
          const slice_val = QUARTERS_PER_YEAR * i;
          const quarters = planner.quarters.slice(
            slice_val,
            slice_val + QUARTERS_PER_YEAR,
          );
          return (
            <PDFQuarters key={i} quarters={quarters} courseState={planner} />
          );
        },
      )}
    </View>
  );
}

function PDFQuarters({
  quarters,
  courseState,
}: {
  quarters: Quarter[];
  courseState: PlannerData;
}) {
  return (
    <View style={styles.yearView}>
      {quarters.map((q) => {
        const courses = findCoursesInQuarter(courseState, q);
        return (
          <PDFQuarter
            key={constructQuarterId(q)}
            quarter={q}
            courses={courses}
          />
        );
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
              <Text>
                {isCustomCourse(course) ? course.title : courseTitle(course)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

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
    width: "auto",
  },
});
