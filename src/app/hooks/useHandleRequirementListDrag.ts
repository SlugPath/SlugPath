import { DraggableLocation } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import { createCourseFromId } from "@/lib/plannerUtils";
import { MajorVerificationContext } from "../contexts/MajorVerificationProvider";
import { useContext } from "react";
import { REQUIREMENT_LIST_DROPPABLE_PREFIX } from "@/lib/consts";
import { StoredCourse } from "../types/Course";
import { RequirementList } from "../types/Requirements";

export default function useHandleRequirementListDrag() {
  const { majorRequirements, findRequirementList, updateRequirementList } =
    useContext(MajorVerificationContext);

  function draggedToRequirementList(droppableId: string) {
    return droppableId.includes(REQUIREMENT_LIST_DROPPABLE_PREFIX);
  }

  function addCourseToRequirementList(
    droppableId: string,
    draggableId: string,
    destination: DraggableLocation,
  ) {
    const len = REQUIREMENT_LIST_DROPPABLE_PREFIX.length;
    const id = droppableId.slice(len);
    const course: StoredCourse = {
      ...createCourseFromId(draggableId),
      id: uuidv4(),
    };
    const requirementList = findRequirementList(id, majorRequirements);
    const index = destination.index;

    if (requirementList) {
      requirementList.requirements.splice(index, 0, course);
      updateRequirementList(id, requirementList);
    }
  }

  function moveCourseRequirementList(
    source: DraggableLocation,
    destination: DraggableLocation,
  ) {
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
      updateRequirementList(sourceId, newRequirementList);
    }

    function moveCourseToNewRequirementList(
      sourceRequirementList: RequirementList,
      destinationRequirementList: RequirementList,
      source: DraggableLocation,
      destination: DraggableLocation,
    ) {
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
      updateRequirementList(sourceId, newSourceRequirementList);
      updateRequirementList(destinationId, newDestinationRequirementList);
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
