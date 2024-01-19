import {
  Card,
  Select,
  Typography,
  Button,
  Input,
  IconButton,
  useColorScheme,
} from "@mui/joy";
import { RequirementList, Binder } from "@/app/types/Requirements";
import FulfillmentMark from "./FulfillmentMark";
import BinderTitle from "./BinderTitle";
import { useContext, useState } from "react";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import Option from "@mui/joy/Option";
import { Delete, Edit } from "@mui/icons-material";
import { getBinderValue, isStoredCourse } from "@/lib/requirementsUtils";
import { Droppable } from "@hello-pangea/dnd";
import { REQUIREMENT_LIST_DROPPABLE_PREFIX } from "@/lib/consts";
import DraggableCourseCard from "../../quarters/courses/DraggableCourseCard";
import { StoredCourse } from "@/app/types/Course";
import { MiniCourseCard } from "@/app/components/majorSelection/MiniCourseCard";

export function RequirementsComponent({
  requirements,
  parents,
}: {
  requirements: RequirementList;
  parents: number;
}) {
  const { mode } = useColorScheme();

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
      <Title requirements={requirements} fulfillmentMark={true} />
      <Typography>{BinderTitle(requirements)}</Typography>
      {requirements.requirements.map((requirement, index) => {
        if ("requirements" in requirement) {
          return (
            <RequirementsComponent
              key={index}
              requirements={requirement}
              parents={parents + 1}
            />
          );
        } else {
          return <Classes key={index} {...requirement} />;
        }
      })}
    </Card>
  );
}

export function RequirementsComponentEditing({
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

  return (
    <Card variant="soft" style={cardStyleProps(parents, mode)}>
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
        <DeleteIconButton
          onClick={() => removeRequirementList(requirements.id)}
        />
      </div>
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
      {hasRequirementLists() ? null : (
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
            <RequirementsComponentEditing
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
