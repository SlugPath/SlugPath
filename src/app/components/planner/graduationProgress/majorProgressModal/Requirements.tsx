import { REQUIREMENT_LIST_DROPPABLE_PREFIX } from "@/lib/consts";
import { getBinderValue, isStoredCourse } from "@/lib/requirementsUtils";
import { MiniCourseCard } from "@components/majorSelection/MiniCourseCard";
import { MajorVerificationContext } from "@contexts/MajorVerificationProvider";
import { StoredCourse } from "@customTypes/Course";
import { Binder, RequirementList } from "@customTypes/Requirements";
import { Droppable } from "@hello-pangea/dnd";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  IconButton,
  Input,
  Select,
  Typography,
  useColorScheme,
} from "@mui/joy";
import Option from "@mui/joy/Option";
import { useContext, useState } from "react";

import DraggableCourseCard from "../../quarters/courses/DraggableCourseCard";
import BinderTitle from "./BinderTitle";
import FulfillmentMark from "./FulfillmentMark";

export function Requirements({
  requirements,
  parents,
  hideTitle,
}: {
  requirements: RequirementList;
  parents: number;
  hideTitle: boolean;
}) {
  const { mode } = useColorScheme();

  function isProgramEmpty() {
    return requirements.requirements.length === 0 && parents === 0;
  }

  const Classes = (requirement: any) => (
    <div className="flex flex-row items-center space-x-1">
      <div className="w-full">
        <MiniCourseCard
          course={requirement}
          quarter={{
            id: "0",
            title: "2021 Fall",
            courses: [],
          }}
        />
      </div>
      <FulfillmentMark {...requirement} />
    </div>
  );

  return (
    <Card variant="soft" style={{ ...cardStyleProps(parents, mode) }}>
      {!hideTitle && (
        <Title requirements={requirements} fulfillmentMark={true} />
      )}
      {isProgramEmpty() ? (
        <Typography className="text-gray-400">
          There is no data for this degree program yet
        </Typography>
      ) : (
        <>
          {/* Binder title */}
          <div className="flex flex-row items-center space-x-1">
            <Typography>{BinderTitle(requirements)}</Typography>
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
  requirements,
  parents,
}: {
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
      updateRequirementList(requirements.id, { ...requirements, title });
    }
    setEditingTitle(!editingTitle);
  }

  function handleNewBinderSelected(
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) {
    if (newValue === "0") {
      updateRequirementList(requirements.id, {
        ...requirements,
        binder: Binder.AND,
      });
    } else if (newValue !== null) {
      updateRequirementList(requirements.id, {
        ...requirements,
        binder: Binder.AT_LEAST,
        atLeast: parseInt(newValue),
      });
    }
  }

  function deleteCourse(course: StoredCourse) {
    updateRequirementList(requirements.id, {
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

  function shouldHaveClasses(parents: number) {
    return parents > 0;
  }

  function shouldDisplayDeleteButton(parents: number) {
    return shouldHaveClasses(parents);
  }

  return (
    <Card variant="soft" style={cardStyleProps(parents, mode)}>
      {/* Title begin */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row">
          {editingTitle ? (
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
          <EditIconButton onClick={handleToggleEditingTitle} />
        </div>
        {shouldDisplayDeleteButton(parents) && (
          <DeleteIconButton
            onClick={() => removeRequirementList(requirements.id)}
          />
        )}
      </div>
      {/* Title end */}

      {/* Binder begin */}
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
      {/* Binder end */}

      {shouldHaveClasses(parents) && !hasRequirementLists() && (
        <Classes
          requirements={requirements}
          deleteCourse={deleteCourse}
          parents={parents}
          mode={mode}
        />
      )}
      <RequirementLists requirements={requirements} parents={parents} />
      {hasClasses() ? null : (
        <Button onClick={() => addRequirementList(requirements.id)}>
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
  requirements,
  parents,
}: {
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
