import { Course } from "@/graphql/course/schema";
import { Button, Checkbox, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useState } from "react";

export default function CourseSelectionModal(
	{
		courses,
		setShowModal,
		onAddCourses,
		showModal,
	} : {
		courses: Course[],
		setShowModal: any,
		onAddCourses: any
		showModal: boolean
	}
) {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

	const handleCheckedChanged = (event: React.ChangeEvent<HTMLInputElement>, course: Course) => {
	  if (event.target.checked) {
      setSelectedCourses([...selectedCourses, course]);
    } else {
      setSelectedCourses(selectedCourses.filter((c) => c.id !== course.id));
    }
	};

  const handleAddCourses = () => {
    onAddCourses(selectedCourses);
    setSelectedCourses([]);
    setShowModal(false);
  }

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
						<Checkbox
							onChange={(event) => handleCheckedChanged(event, course)}
							key={index}
							label={'CSE ' + course.number + ': ' + course.name}
						/>
					))}
				</div>
				<ModalClose variant="plain" sx={{ m: 1 }} />
				<div className="flex justify-end">
					<AddCoursesButton selectedCourses={selectedCourses} handleAddCourses={handleAddCourses} />
				</div>
			</Sheet>
		</Modal>
	)
}

function AddCoursesButton({selectedCourses, handleAddCourses}: {selectedCourses: Course[], handleAddCourses: any}) {
  const addCourseBtnName = (selectedCourses.length > 0 ? `(${selectedCourses.length}) ` : '') + (selectedCourses.length > 1 ? "Add courses" : `Add course`);

  return (
    <Button
      disabled={selectedCourses.length == 0}
      className="flex align-self-end"
      onClick={handleAddCourses}
    >{addCourseBtnName}</Button>
  )
}