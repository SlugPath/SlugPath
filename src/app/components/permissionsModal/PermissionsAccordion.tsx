import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemContent,
  Select,
  Option,
  Card,
  AccordionSummary,
  AccordionDetails,
} from "@mui/joy";
import { SyntheticEvent, useState } from "react";
import { Major } from "@/app/types/Major";
import CloseIconButton from "../CloseIconButton";
import { Permissions } from "@/app/types/Permissions";
import StyledAccordion from "../planner/StyledAccordion";

export default function PermissionsAccordion({
  permissions,
  majors,
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
}: {
  permissions: Permissions;
  majors: Major[];
  onAddMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemoveMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemovePermissions: (permissions: Permissions) => void;
}) {
  return (
    <StyledAccordion>
      <AccordionSummary>
        <div className="flex flex-row ml-2 gap-1 items-center justify-between w-full">
          <Typography>{permissions.userEmail}</Typography>
          <Button
            color="danger"
            onClick={() => onRemovePermissions(permissions)}
          >
            Remove
          </Button>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {permissions.majorsAllowedToEdit.map((major, index) => {
            return (
              <ListItem key={index}>
                <ListItemContent>
                  <Card
                    variant="plain"
                    size="sm"
                    className="flex flex-row gap-1 items-center justify-between p-1"
                  >
                    <Typography>
                      {major.name} {major.catalogYear}
                    </Typography>
                    <CloseIconButton
                      onClick={() =>
                        onRemoveMajorEditPermission(permissions, major)
                      }
                    />
                  </Card>
                </ListItemContent>
              </ListItem>
            );
          })}
        </List>
        <SelectMajor
          majors={majors}
          permissions={permissions}
          onAddMajorEditPermission={onAddMajorEditPermission}
        />
      </AccordionDetails>
    </StyledAccordion>
  );
}

function SelectMajor({
  majors,
  permissions,
  onAddMajorEditPermission,
}: {
  majors: Major[];
  permissions: Permissions;
  onAddMajorEditPermission: (permissions: Permissions, major: Major) => void;
}) {
  const [value, setValue] = useState<Major | null>(null);

  function onChange(
    event: SyntheticEvent<Element, Event> | null,
    newValue: Major | null,
  ) {
    if (newValue) {
      onAddMajorEditPermission(permissions, newValue);
      setValue(null);
    }
  }

  return (
    <Select
      value={value}
      placeholder="Add a major..."
      variant="plain"
      onChange={onChange}
      disabled={majors.length == 0}
    >
      {majors.map((major, index) => (
        <Option key={index} value={major}>
          {major.name} {major.catalogYear}
        </Option>
      ))}
    </Select>
  );
}
