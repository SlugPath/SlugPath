import { REQUIREMENT_LIST_DROPPABLE_PREFIX } from "@/lib/consts";
import { createCourseFromId } from "@/lib/plannerUtils";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { DraggableLocation, DropResult } from "@hello-pangea/dnd";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";

import { StoredCourse } from "../types/Course";
import { Program } from "../types/Program";
import { RequirementList } from "../types/Requirements";

export default function useHandleRequirementListDrag(
  majorToEdit: Program | undefined | null,
) {
  const {
    getRequirementsForMajor,
    findRequirementList,
    updateRequirementList,
  } = useContext(MajorVerificationContext);

  const majorRequirements = majorToEdit
    ? getRequirementsForMajor(majorToEdit!.id)
    : undefined;

  function draggedToRequirementList(droppableId: string) {
    return droppableId.includes(REQUIREMENT_LIST_DROPPABLE_PREFIX);
  }

  function addCourseToRequirementList(
    droppableId: string,
    draggableId: string,
    destination: DraggableLocation,
  ) {
    function requirementListHasCourse(
      requirementList: RequirementList,
      course: StoredCourse,
    ) {
      return requirementList.requirements.find((c) => {
        const someCourse = c as StoredCourse;
        return (
          someCourse.title === course.title &&
          someCourse.number === course.number
        );
      });
    }

    if (majorRequirements === undefined) return;

    const len = REQUIREMENT_LIST_DROPPABLE_PREFIX.length;
    const id = droppableId.slice(len);
    const course: StoredCourse = {
      ...createCourseFromId(draggableId),
      id: uuidv4(),
    };
    const requirementList = findRequirementList(id, majorRequirements);
    const index = destination.index;

    if (requirementList) {
      if (requirementListHasCourse(requirementList, course)) return;

      requirementList.requirements.splice(index, 0, course);
      updateRequirementList(majorToEdit!.id, id, requirementList);
    }
  }

  function moveCourseRequirementList(
    source: DraggableLocation,
    destination: DraggableLocation,
  ) {
    if (majorRequirements === undefined) return;

    const len = REQUIREMENT_LIST_DROPPABLE_PREFIX.length;
    const sourceId = source.droppableId.slice(len);
    const destinationId = destination.droppableId.slice(len);
    const sourceRequirementList = findRequirementList(
      sourceId,
      majorRequirements,
    );
    const destinationRequirementList = findRequirementList(
      destinationId,
      majorRequirements,
    );

    function isSameRequirementList(sourceId: string, destinationId: string) {
      return sourceId === destinationId;
    }

    function moveCourseWithinRequirementList(
      requirementList: RequirementList,
      source: DraggableLocation,
      destination: DraggableLocation,
    ) {
      if (!majorToEdit) return;

      const newRequirements = Array.from(requirementList.requirements);
      newRequirements.splice(source.index, 1);
      newRequirements.splice(
        destination.index,
        0,
        requirementList.requirements[source.index],
      );
      const newRequirementList = {
        ...requirementList,
        requirements: newRequirements,
      };
      updateRequirementList(majorToEdit.id, sourceId, newRequirementList);
    }

    function moveCourseToNewRequirementList(
      sourceRequirementList: RequirementList,
      destinationRequirementList: RequirementList,
      source: DraggableLocation,
      destination: DraggableLocation,
    ) {
      if (majorToEdit === undefined) return;

      const newSourceRequirements = Array.from(
        sourceRequirementList.requirements,
      );
      const newDestinationRequirements = Array.from(
        destinationRequirementList.requirements,
      );
      newDestinationRequirements.splice(
        destination.index,
        0,
        newSourceRequirements[source.index],
      );
      newSourceRequirements.splice(source.index, 1);
      const newSourceRequirementList = {
        ...sourceRequirementList,
        requirements: newSourceRequirements,
      };
      const newDestinationRequirementList = {
        ...destinationRequirementList,
        requirements: newDestinationRequirements,
      };
      updateRequirementList(
        majorToEdit!.id,
        sourceId,
        newSourceRequirementList,
      );
      updateRequirementList(
        majorToEdit!.id,
        destinationId,
        newDestinationRequirementList,
      );
    }

    if (sourceRequirementList) {
      if (isSameRequirementList(sourceId, destinationId)) {
        moveCourseWithinRequirementList(
          sourceRequirementList,
          source,
          destination,
        );
      } else if (destinationRequirementList) {
        moveCourseToNewRequirementList(
          sourceRequirementList,
          destinationRequirementList,
          source,
          destination,
        );
      }
    }
  }

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (draggedToRequirementList(destination.droppableId)) {
      addCourseToRequirementList(
        destination.droppableId,
        draggableId,
        destination,
      );
    } else if (draggedToRequirementList(source.droppableId)) {
      moveCourseRequirementList(source, destination);
    }
  }

  return {
    handleDragEnd,
  };
}
