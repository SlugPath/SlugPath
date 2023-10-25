import { Course } from "../ts-types/Course";
import { Button, Card, Checkbox, Modal, ModalClose, Sheet, Typography, styled } from "@mui/joy";
import { useState } from "react";
import { Tree, TreeNode } from 'react-organizational-chart';

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

type Requirement = {
  courseName: string;
};
type RequirementGroup = {
  binder: "AND" | "OR";
  requirements: Requirements[];
};
type Requirements = Requirement | RequirementGroup;

const requirements = ["CSE 12", "CSE 20", "CSE 30", "CSE 16", "MATH 19A", "MATH 19B"]
const prerequisites: { [key: string]: string[] } = {
  "CSE 12": ["CSE 20"],
  "CSE 30": ["CSE 20"],
  "CSE 16": ["MATH 19A"],
  "MATH 19B": ["MATH 19A"],
}
// const completedCourses: string[] = ["CSE 20", "MATH 19A"]
const completedCourses: string[] = []

function MajorCompletionTree() {

  function getCoursePrerequisites(course: string): string[] {
    if (prerequisites[course]) {
      return prerequisites[course]
    } else {
      return []
    }
  }

  function createTree(requirements: string[], prerequisites: any) {
    const tree: any[] = []
    requirements.forEach((course: string, index: number) => {
      const coursePrerequisites = getCoursePrerequisites(course)

      if (coursePrerequisites.length > 0) {
        tree.push(
          <TreeNode key={index} label={<StyledNode course={course} />} >
            {createTree(coursePrerequisites, prerequisites)}
          </TreeNode>
        )
      } else {
        tree.push(<TreeNode key={index} label={<StyledNode course={course} />} />)
      }
    })
    return tree
  }


  return (
    <Tree
      lineWidth={'2px'}
      lineColor={'black'}
      lineBorderRadius={'10px'}
      label={<StyledNode course="Lower Division Courses" />}
    >
      {createTree(requirements, prerequisites)}
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