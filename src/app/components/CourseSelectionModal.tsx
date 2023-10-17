import { Course } from "@/graphql/course/schema";
import { Button, Checkbox, Modal, ModalClose, Sheet, Typography } from "@mui/joy";

// TODO: add a parameter here for the onAddCourses function
// TODO: add a useState hook to keep track of selected courses in the modal
export default function CourseSelectionModal(
	{
		courses,
		setShowModal,
		showModal
	} : {
		courses: Course[],
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
					CSE Courses
				</Typography>
				{courses.length === 0 ? (<div>Loading</div>) : (<div></div>)}
				<div className="grid grid-cols-4 gap-2">
				{courses.slice(0, 30).map((course: Course, index: number) => (
						// TODO: when course is checked, make sure to add it to the selected courses state
						<Checkbox key={index} label={'CSE ' + course.number + ': ' + course.name} />
					))}
				</div>
				<ModalClose variant="plain" sx={{ m: 1 }} />
				<div className="flex justify-end">
					{/* TODO: add all of the courses to the currently selected quarter using the selectedQuarter (which is an id) parameter */}
					<Button className="flex align-self-end" onClick={() => setShowModal(false)}>Add courses</Button>
				</div>
			</Sheet>
		</Modal>
	)
}