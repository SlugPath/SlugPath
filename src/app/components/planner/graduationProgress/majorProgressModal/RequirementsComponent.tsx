import { Card, Select, Typography, Button, Input, IconButton } from "@mui/joy";
import { RequirementList, Binder } from "@/app/types/Requirements";
import FulfillmentMark from "./FulfillmentMark";
import BinderTitle from "./BinderTitle";
import { useContext, useState } from "react";
import { MajorVerificationContext } from "@/app/contexts/MajorVerificationProvider";
import Option from "@mui/joy/Option";
import { Delete, Edit } from "@mui/icons-material";
import { getBinderValue } from "@/lib/requirementsUtils";

export function RequirementsComponent(requirements: RequirementList) {
  const Classes = (requirement: any) => (
    <div className="flex flex-row items-center space-x-1">
      <Typography>
        {requirement.departmentCode} {requirement.number}
      </Typography>
      <FulfillmentMark {...requirement} />
    </div>
  );

  return (
    <Card>
      <Title requirements={requirements} fulfillmentMark={true} />
      <Typography>{BinderTitle(requirements)}</Typography>
      {requirements.requirements.map((requirement, index) => {
        if ("requirements" in requirement) {
          return <RequirementsComponent key={index} {...requirement} />;
        } else {
          return <Classes key={index} {...requirement} />;
        }
      })}
    </Card>
  );
}

export function RequirementsComponentEditing({
  requirements,
}: {
  requirements: RequirementList;
}) {
  const { addRequirementList, removeRequirementList, updateRequirementList } =
    useContext(MajorVerificationContext);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(requirements.title);

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

  const Classes = (requirement: any) => (
    <div className="flex flex-row items-center space-x-1">
      <Typography>
        {requirement.departmentCode} {requirement.number}
      </Typography>
      <FulfillmentMark {...requirement} />
    </div>
  );

  return (
    <Card>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row">
          {editingTitle ? (
            <EditableTitle title={title ?? ""} setTitle={setTitle} />
          ) : (
            <Title requirements={requirements} fulfillmentMark={false} />
          )}
          <EditIconButton onClick={handleToggleEditingTitle} />
        </div>
        <DeleteIconButton
          onClick={() => removeRequirementList(requirements.id)}
        />
      </div>
      <div className="flex flex-row items-center space-x-1">
        <Select
          placeholder="Choose one…"
          defaultValue={getBinderValue(requirements)}
          onChange={handleNewBinderSelected}
        >
          <Option value="0">All</Option>
          {Array.from({ length: 11 }, (_, index) => index).map((i) => {
            return (
              <Option key={i + 1} value={i + 1}>
                {i + 1}
              </Option>
            );
          })}
        </Select>
        <Typography>of the following</Typography>
      </div>
      {requirements.requirements.map((requirement, index) => {
        if ("requirements" in requirement) {
          return (
            <RequirementsComponentEditing
              key={index}
              requirements={requirement}
            />
          );
        } else {
          return <Classes key={index} {...requirement} />;
        }
      })}
      <Button onClick={() => addRequirementList(requirements.id)}>
        + Add Requirement List
      </Button>
    </Card>
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
}: {
  title: string;
  setTitle: (title: string) => void;
}) {
  return (
    <Input
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
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
