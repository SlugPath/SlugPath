import { Card, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { Tree, TreeNode } from 'react-organizational-chart';
import { Binder, Requirements } from "../ts-types/Requirements";
import { getCoursesFromRequirements, getBinderFromRequirements, getRequirementsLength, removeCoursesWhoseSiblingsHaveItAsRequirement } from "../logic/CourseRequirements";

type Prerequisites = { [key: string]: Requirements }
const requirements: Requirements = {binder: Binder.AND, requirements: ["CSE 12", "CSE 20", "CSE 30", "CSE 16", "MATH 19A", "MATH 19B", "CSE 13S", "CSE 101"]}
const prerequisites: Prerequisites = {
  "CSE 12": {binder: Binder.AND, requirements: ["CSE 20"]},
  "CSE 30": {binder: Binder.AND, requirements: ["CSE 20"]},
  "CSE 16": {binder: Binder.OR, requirements: ["MATH 19A", "MATH 19B"]},
  "MATH 19B": {binder: Binder.OR, requirements: ["MATH 19A", "MATH 20A"]},
  "CSE 13S": {binder: Binder.AND, requirements: ["CSE 12"]},
  "CSE 101": {binder: Binder.AND, requirements: ["CSE 12", "CSE 13S", "MATH 19B"]},
}
const completedCourses: string[] = ["CSE 20", "MATH 19A"]
// const completedCourses: string[] = []

export default function MajorCompletionModal(
	{
		setShowModal,
		showModal,
	} : {
		setShowModal: any,
		showModal: boolean
	}
) {

	return (
		<Modal
			open={showModal}
			onClose={() => setShowModal(false)}
			sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
		>
			<Sheet
				variant="outlined"
				sx={{
					margin: 10,
					borderRadius: 'md',
					p: 3,
					boxShadow: 'lg',
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
	)
}

function createOrRequirementsString(courses: string[]): string {
  let requirementName: string = "";
  courses.forEach((course: string, index: number) => {
    if (index === courses.length - 1) {
      requirementName += course
    } else {
      requirementName += course + " or "
    }
  })
  return requirementName
}

function MajorCompletionTree() {

  function getCoursePrerequisites(course: string): Requirements {
    if (prerequisites[course]) {
      return prerequisites[course]
    } else {
      return {binder: Binder.AND, requirements: []}
    }
  }

  function createRequirementsTree(requirements: Requirements, prerequisites: any) {
    const tree: any[] = []
    const binder = getBinderFromRequirements(requirements)
    const courses: string[] = getCoursesFromRequirements(requirements)

    if (binder === Binder.AND) {
      const filteredCourses: string[] = removeCoursesWhoseSiblingsHaveItAsRequirement(courses, prerequisites)
      filteredCourses.forEach((course: string, index: number) => {

        const coursePrerequisites = getCoursePrerequisites(course)

        if (getRequirementsLength(coursePrerequisites) > 0) {
          tree.push(
            <TreeNode key={index} label={<StyledNode course={course} />} >
              {createRequirementsTree(coursePrerequisites, prerequisites)}
            </TreeNode>
          )
        } else {
          tree.push(<TreeNode key={index} label={<StyledNode course={course} />} />)
        }
      })
    } else {
      tree.push(
        <TreeNode key={0} label={<StyledNode course={createOrRequirementsString(courses)} />} />
      )
    }
    return tree
  }

  return (
    <Tree
      lineWidth={'2px'}
      lineColor={'black'}
      lineBorderRadius={'10px'}
      label={<StyledNode course="Lower Division Courses" />}
    >
      {createRequirementsTree(requirements, prerequisites)}
    </Tree>
  )
}

function StyledNode({ course, children }: { course: string, children?: any }) {
  const completed = completedCourses.includes(course)

  return (
    <div>
      <Card style={completed ? { background: "lightgreen" } : {}} sx={{  width: 'fit-content', mx: 'auto' }}>
        {course}
        {children}
      </Card>
    </div>
  )
}