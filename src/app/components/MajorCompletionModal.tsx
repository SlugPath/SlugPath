import { Card, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { Binder, Requirements } from "../ts-types/Requirements";
import {
  getCoursesFromRequirements,
  getBinderFromRequirements,
  getRequirementsLength,
  removeCoursesWhoseSiblingsHaveItAsRequirement,
  createOrRequirementsString,
} from "../logic/CourseRequirements";
import dynamic from "next/dynamic";

const Tree = dynamic(
  () => {
    return import("react-organizational-chart").then((mod) => mod.Tree);
  },
  { ssr: false },
);
const TreeNode = dynamic(
  () => {
    return import("react-organizational-chart").then((mod) => mod.TreeNode);
  },
  { ssr: false },
);

type Prerequisites = { [key: string]: Requirements };
const requirements: Requirements = {
  binder: Binder.AND,
  requirements: [
    "CSE 12",
    "CSE 16",
    "CSE 20",
    "CSE 30",
    "CSE 13S",
    {
      binder: Binder.OR,
      requirements: [
        { binder: Binder.AND, requirements: ["MATH 19A", "MATH 19B"] },
      ],
    },
    { binder: Binder.OR, requirements: ["AM 10", "MATH 21"] },
    { binder: Binder.OR, requirements: ["AM 30", "MATH 23A"] },
    "ECE 30",
    "CSE 101",
    "CSE 101M",
    "CSE 102",
    "CSE 103",
    "CSE 120",
    "CSE 130",
    { binder: Binder.OR, requirements: ["CSE 112", "CSE 114A"] },
    { binder: Binder.OR, requirements: ["CSE 112", "CSE 114A"] },
    { binder: Binder.OR, requirements: ["STAT 131", "CSE 107"] },
  ],
};

const prerequisites: Prerequisites = {
  "CSE 12": { binder: Binder.AND, requirements: ["CSE 20"] },
  "CSE 30": { binder: Binder.AND, requirements: ["CSE 20"] },
  "CSE 16": { binder: Binder.OR, requirements: ["MATH 19A", "MATH 19B"] },
  "MATH 19B": { binder: Binder.OR, requirements: ["MATH 19A", "MATH 20A"] },
  "CSE 13S": { binder: Binder.AND, requirements: ["CSE 12"] },
  "CSE 101": {
    binder: Binder.AND,
    requirements: ["CSE 12", "CSE 13S", "MATH 19B", "CSE 16"],
  },
  "MATH 23A": { binder: Binder.OR, requirements: ["MATH 19B", "MATH 20B"] },
  "ECE 30": { binder: Binder.AND, requirements: ["MATH 19B"] },
  "CSE 101M": { binder: Binder.AND, requirements: ["CSE 101"] },
  "CSE 102": { binder: Binder.AND, requirements: ["CSE 101"] },
  "CSE 103": { binder: Binder.AND, requirements: ["CSE 101"] },
  "CSE 120": { binder: Binder.AND, requirements: ["CSE 12", "CSE 13S"] },
  "CSE 130": { binder: Binder.AND, requirements: ["CSE 12", "CSE 101"] },
  "CSE 112": { binder: Binder.AND, requirements: ["CSE 101"] },
  "CSE 114A": { binder: Binder.AND, requirements: ["CSE 101"] },
  "STAT 131": { binder: Binder.OR, requirements: ["MATH 19B", "MATH 20B"] },
  "CSE 107": { binder: Binder.OR, requirements: ["CSE 16", "AM 30"] },
};
const completedCourses: string[] = ["CSE 20", "MATH 19A"];

export default function MajorCompletionModal({
  setShowModal,
  showModal,
}: {
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
          <MajorCompletionTree />
        </Typography>
        <ModalClose variant="plain" sx={{ m: 1 }} />
      </Sheet>
    </Modal>
  );
}

function MajorCompletionTree() {
  function getCoursePrerequisites(course: string): Requirements {
    if (prerequisites[course]) {
      return prerequisites[course];
    } else {
      return { binder: Binder.AND, requirements: [] };
    }
  }

  function createRequirementsTree(
    requirements: Requirements,
    prerequisites: any,
  ) {
    const tree: any[] = [];
    const binder = getBinderFromRequirements(requirements);
    const courses: string[] = getCoursesFromRequirements(requirements);

    if (binder === Binder.AND) {
      const filteredCourses: string[] =
        removeCoursesWhoseSiblingsHaveItAsRequirement(courses, prerequisites);
      filteredCourses.forEach((course: string, index: number) => {
        const coursePrerequisites = getCoursePrerequisites(course);

        if (getRequirementsLength(coursePrerequisites) > 0) {
          tree.push(
            <TreeNode key={index} label={<StyledNode courses={[course]} />}>
              {createRequirementsTree(coursePrerequisites, prerequisites)}
            </TreeNode>,
          );
        } else {
          tree.push(
            <TreeNode key={index} label={<StyledNode courses={[course]} />} />,
          );
        }
      });
    } else {
      tree.push(<TreeNode key={0} label={<StyledNode courses={courses} />} />);
    }
    return tree;
  }

  return (
    <Tree
      lineWidth={"2px"}
      lineColor={"black"}
      lineBorderRadius={"10px"}
      label={<StyledNode courses={["Lower Division Courses"]} />}
    >
      {createRequirementsTree(requirements, prerequisites)}
    </Tree>
  );
}

function StyledNode({
  courses,
  children,
}: {
  courses: string[];
  children?: any;
}) {
  let completed = false;
  courses.forEach((course: string) => {
    if (completedCourses.includes(course)) {
      completed = true;
    }
  });
  const nodeName = createOrRequirementsString(courses);

  return (
    <div>
      <Card
        style={completed ? { background: "lightgreen" } : {}}
        sx={{ width: "fit-content", mx: "auto" }}
      >
        {nodeName}
        {children}
      </Card>
    </div>
  );
}
