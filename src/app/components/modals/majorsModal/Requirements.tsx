import { MiniCourseCard } from "@/app/components/modals/majorsModal/majorSelection/MiniCourseCard";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import { StoredCourse } from "@/app/types/Course";
import { Major } from "@/app/types/Major";
import { Binder, RequirementList } from "@/app/types/Requirements";
import { REQUIREMENT_LIST_DROPPABLE_PREFIX } from "@/lib/consts";
import { getBinderValue, isStoredCourse } from "@/lib/requirementsUtils";
import { Droppable } from "@hello-pangea/dnd";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  Chip,
  IconButton,
  Input,
  Select,
  Textarea,
  Typography,
  useColorScheme,
} from "@mui/joy";
import Option from "@mui/joy/Option";
import { useContext, useState } from "react";

import DraggableCourseCard from "../../planner/quarters/courses/DraggableCourseCard";
import BinderTitle from "./BinderTitle";
import FulfillmentMark from "./FulfillmentMark";

export function Requirements({
  major,
  requirements,
  parents,
  hideTitle,
  hasEditPermission,
  onClickEdit,
}: {
  major: Major;
  requirements: RequirementList;
  parents: number;
  hideTitle: boolean;
  hasEditPermission?: boolean;
  onClickEdit?: (major: Major) => void;
}) {
  const { mode } = useColorScheme();

  function isProgramEmpty() {
    return requirements.requirements.length === 0 && parents === 0;
  }

  const Classes = (requirement: any) => (
    <div className="flex flex-row items-center space-x-1">
      <div className="w-full">
        <MiniCourseCard course={requirement} />
      </div>
      <FulfillmentMark {...requirement} />
    </div>
  );

  return (
    <Card
      variant="soft"
      style={{ ...cardStyleProps(parents, mode) }}
      className="m-0"
    >
      {/* Title start */}
      {!hideTitle && (
        <div className="flex flex-row justify-between items-center">
          <Title requirements={requirements} fulfillmentMark={true} />
          {hasEditPermission && parents == 0 && (
            <div className="flex flex-row items-center">
              <Chip color="success" variant="solid" className="mr-6">
                You have edit permission
              </Chip>
              {onClickEdit && (
                <Button onClick={() => onClickEdit(major)}>Edit</Button>
              )}
            </div>
          )}
        </div>
      )}
      {/* Title end */}

      {/* Notes start */}
      {requirements && requirements.notes && requirements.notes.length > 0 && (
        <Textarea
          variant="soft"
          value={requirements.notes}
          readOnly
          style={{
            ...cardStyleProps(parents, mode),
          }}
          sx={{
            "--Textarea-focusedThickness": "0.0rem",
            boxShadow: "none",
          }}
        />
      )}
      {/* Notes end */}

      {isProgramEmpty() ? (
        <Typography className="text-gray-400">
          There is no requirements data for this degree program yet
        </Typography>
      ) : (
        <>
          {/* Binder title */}
          <div className="flex flex-row items-center space-x-1">
            <Typography fontWeight="md">{BinderTitle(requirements)}</Typography>
            {/* if there is no title, display the FulfillmentMark next to the Binder Title */}
            {requirements.title!.length == 0 && (
              <FulfillmentMark {...requirements} />
            )}
          </div>

          {/* Either a list of Requirement Lists or classes */}
          {requirements.requirements.map((requirement, index) => {
            if ("requirements" in requirement) {
              return (
                <Requirements
                  key={index}
                  major={major}
                  requirements={requirement}
                  parents={parents + 1}
                  hideTitle={false}
                />
              );
            } else {
              return <Classes key={index} {...requirement} />;
            }
          })}
        </>
      )}
    </Card>
  );
}

export function RequirementsEditing({
  major,
  requirements,
  parents,
}: {
  major: Major;
  requirements: RequirementList;
  parents: number;
}) {
  const { addRequirementList, removeRequirementList, updateRequirementList } =
    useContext(MajorVerificationContext);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(requirements.title);
  const { mode } = useColorScheme();

  function handleToggleEditingTitle() {
    if (editingTitle) {
      updateRequirementList(major.id, requirements.id, {
        ...requirements,
        title,
      });
    }
    setEditingTitle(!editingTitle);
  }

  function handleUpdateNotes(notes: string) {
    updateRequirementList(major.id, requirements.id, {
      ...requirements,
      notes,
    });
  }

  function handleNewBinderSelected(
    _: React.SyntheticEvent | null,
    newValue: string | null,
  ) {
    if (newValue === "0") {
      updateRequirementList(major.id, requirements.id, {
        ...requirements,
        binder: Binder.AND,
      });
    } else if (newValue !== null) {
      updateRequirementList(major.id, requirements.id, {
        ...requirements,
        binder: Binder.AT_LEAST,
        atLeast: parseInt(newValue),
      });
    }
  }

  function deleteCourse(course: StoredCourse) {
    updateRequirementList(major.id, requirements.id, {
      ...requirements,
      requirements: requirements.requirements.filter(
        (requirement) => requirement !== course,
      ),
    });
  }

  function hasRequirementLists() {
    return requirements.requirements.some(
      (requirement) => "requirements" in requirement,
    );
  }

  function hasClasses() {
    return requirements.requirements.some(
      (requirement) => !("requirements" in requirement),
    );
  }

  function shouldDisplayDeleteButton(parents: number) {
    return !isGreatestParent(parents);
  }

  // user cannot edit title of the parent RequirementList
  function isGreatestParent(parents: number) {
    return parents == 0;
  }

  return (
    <Card
      variant="soft"
      style={cardStyleProps(parents, mode)}
      className="space-y-2"
    >
      {/* Title begin */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row">
          {editingTitle && !isGreatestParent(parents) ? (
            <EditableTitle
              title={title ?? ""}
              setTitle={setTitle}
              handleEndEditing={handleToggleEditingTitle}
              parents={parents}
              mode={mode}
            />
          ) : (
            <Title requirements={requirements} fulfillmentMark={true} />
          )}
          {!isGreatestParent(parents) && (
            <EditIconButton onClick={handleToggleEditingTitle} />
          )}
        </div>
        {shouldDisplayDeleteButton(parents) && (
          <DeleteIconButton
            onClick={() => removeRequirementList(major.id, requirements.id)}
          />
        )}
      </div>
      {/* Title end */}

      {/* Notes start */}
      <div>
        <Textarea
          variant="soft"
          value={requirements.notes || ""}
          onChange={(e) => handleUpdateNotes(e.target.value)}
          placeholder="Add notes..."
          style={{ ...cardStyleProps(parents + 1, mode) }}
        />
      </div>
      {/* Notes start */}

      {/* Binder begin */}
      {!isGreatestParent(parents) && (
        <div className="flex flex-row items-center space-x-1">
          <Select
            variant="soft"
            placeholder="Choose one…"
            defaultValue={getBinderValue(requirements)}
            onChange={handleNewBinderSelected}
            style={{ ...cardStyleProps(parents + 1, mode) }}
          >
            <Option value="0">All</Option>
            {Array.from({ length: 11 }, (_, index) => index).map((i) => {
              return (
                <Option key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </Option>
              );
            })}
          </Select>
          <Typography>of the following</Typography>
        </div>
      )}
      {/* Binder end */}

      {!isGreatestParent(parents) && !hasRequirementLists() && (
        <Classes
          requirements={requirements}
          deleteCourse={deleteCourse}
          parents={parents}
          mode={mode}
        />
      )}
      <RequirementLists
        major={major}
        requirements={requirements}
        parents={parents}
      />
      {hasClasses() ? null : (
        <Button onClick={() => addRequirementList(major.id, requirements.id)}>
          + Add Requirement List
        </Button>
      )}
    </Card>
  );
}

function cardStyleProps(parents: number, mode: string | undefined) {
  if (parents % 2 === 1) {
    if (mode === "dark") {
      return {
        backgroundColor: "black",
      };
    } else {
      return {
        backgroundColor: "white",
      };
    }
  }
  return {};
}

function Classes({
  requirements,
  deleteCourse,
  parents,
  mode,
}: {
  requirements: RequirementList;
  deleteCourse: (course: StoredCourse) => void;
  parents: number;
  mode?: string;
}) {
  const droppableId = REQUIREMENT_LIST_DROPPABLE_PREFIX + requirements.id;

  function classes(): StoredCourse[] {
    const classes: StoredCourse[] = [];

    requirements.requirements.forEach((requirement) => {
      const course = requirement as StoredCourse;
      if (isStoredCourse(course)) {
        classes.push(course);
      }
    });

    return classes;
  }

  return (
    <Droppable droppableId={droppableId}>
      {(provided) => {
        return (
          <Card
            {...provided.droppableProps}
            ref={provided.innerRef}
            variant="soft"
            size="sm"
            style={{
              ...cardStyleProps(parents + 1, mode),
              minHeight: "32px",
            }}
            className="rounded-md"
          >
            {classes().map((course, index) => {
              return (
                <DraggableCourseCard
                  key={index}
                  course={course}
                  index={index}
                  draggableId={course.id}
                  quarterId={droppableId}
                  isCustom={false}
                  customDeleteCourse={() => {
                    deleteCourse(course);
                  }}
                />
              );
            })}
            {classes().length === 0 && (
              <Typography className="text-gray-400">
                Drag classes here
              </Typography>
            )}
            {provided.placeholder}
          </Card>
        );
      }}
    </Droppable>
  );
}

function RequirementLists({
  major,
  requirements,
  parents,
}: {
  major: Major;
  requirements: RequirementList;
  parents: number;
}) {
  const requirementsWithoutClasses = requirements.requirements.filter(
    (requirement) => "requirements" in requirement,
  );

  return (
    <>
      {requirementsWithoutClasses.map((requirement, index) => {
        if ("requirements" in requirement) {
          return (
            <RequirementsEditing
              key={index}
              major={major}
              requirements={requirement}
              parents={parents + 1}
            />
          );
        }
      })}
    </>
  );
}

function Title({
  requirements,
  fulfillmentMark,
}: {
  requirements: RequirementList;
  fulfillmentMark?: boolean;
}) {
  return (
    <>
      {requirements.title ? (
        <div className="flex flex-row items-center space-x-1">
          <Typography level="title-lg">{requirements.title}</Typography>
          {fulfillmentMark ? <FulfillmentMark {...requirements} /> : null}
        </div>
      ) : null}
    </>
  );
}

function EditableTitle({
  title,
  setTitle,
  handleEndEditing,
  parents,
  mode,
}: {
  title: string;
  setTitle: (title: string) => void;
  handleEndEditing: () => void;
  parents: number;
  mode: string | undefined;
}) {
  function handleSubmit() {
    handleEndEditing();
  }

  return (
    <Input
      style={{ ...cardStyleProps(parents + 1, mode) }}
      variant="soft"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSubmit();
        }
      }}
    />
  );
}

function EditIconButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton onClick={onClick}>
      <Edit />
    </IconButton>
  );
}

function DeleteIconButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton onClick={onClick} color="danger">
      <Delete />
    </IconButton>
  );
}
