import { REQUIREMENT_LIST_DROPPABLE_PREFIX } from "@/lib/consts";
import { createCourseFromId } from "@/lib/plannerUtils";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { DraggableLocation } from "@hello-pangea/dnd";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";

import { StoredCourse } from "../types/Course";
import { Program } from "../types/Program";
import { RequirementList } from "../types/Requirements";

export default function useHandleRequirementListDrag() {
  const {
    getRequirementsForMajor,
    findRequirementList,
    updateRequirementList,
  } = useContext(MajorVerificationContext);

  // TODO: pass majorToEdit as a parameter
  // This is a placeholder for the major that is being edited, used to be
  // retrieved from the modalContext, currently has no way to be passed in
  const programToEdit = undefined as undefined | Program;

  const programRequirements =
    programToEdit !== undefined
      ? getRequirementsForMajor(programToEdit!.id)
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

    if (programRequirements === undefined) return;

    const len = REQUIREMENT_LIST_DROPPABLE_PREFIX.length;
    const id = droppableId.slice(len);
    const course: StoredCourse = {
      ...createCourseFromId(draggableId),
      id: uuidv4(),
    };
    const requirementList = findRequirementList(id, programRequirements);
    const index = destination.index;

    if (requirementList) {
      if (requirementListHasCourse(requirementList, course)) return;

      requirementList.requirements.splice(index, 0, course);
      updateRequirementList(programToEdit!.id, id, requirementList);
    }
  }

  function moveCourseRequirementList(
    source: DraggableLocation,
    destination: DraggableLocation,
  ) {
    if (programRequirements === undefined) return;

    const len = REQUIREMENT_LIST_DROPPABLE_PREFIX.length;
    const sourceId = source.droppableId.slice(len);
    const destinationId = destination.droppableId.slice(len);
    const sourceRequirementList = findRequirementList(
      sourceId,
      programRequirements,
    );
    const destinationRequirementList = findRequirementList(
      destinationId,
      programRequirements,
    );

    function isSameRequirementList(sourceId: string, destinationId: string) {
      return sourceId === destinationId;
    }

    function moveCourseWithinRequirementList(
      requirementList: RequirementList,
      source: DraggableLocation,
      destination: DraggableLocation,
    ) {
      if (programToEdit === undefined) return;

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
      updateRequirementList(programToEdit.id, sourceId, newRequirementList);
    }

    function moveCourseToNewRequirementList(
      sourceRequirementList: RequirementList,
      destinationRequirementList: RequirementList,
      source: DraggableLocation,
      destination: DraggableLocation,
    ) {
      if (programToEdit === undefined) return;

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
        programToEdit.id,
        sourceId,
        newSourceRequirementList,
      );
      updateRequirementList(
        programToEdit.id,
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

  return {
    draggedToRequirementList,
    addCourseToRequirementList,
    moveCourseRequirementList,
  };
}
