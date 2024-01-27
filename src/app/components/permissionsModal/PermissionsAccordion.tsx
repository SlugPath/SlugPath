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
  Chip,
} from "@mui/joy";
import { SyntheticEvent, useState } from "react";
import { Major } from "@/app/types/Major";
import CloseIconButton from "../CloseIconButton";
import { Permissions } from "@/app/types/Permissions";
import StyledAccordion from "../planner/StyledAccordion";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  experimental_extendTheme as extendMaterialTheme,
  THEME_ID,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const materialTheme = extendMaterialTheme();

export default function PermissionsAccordion({
  permissions,
  majors,
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
  onUpdateMajorEditPermissionExpirationDate,
}: {
  permissions: Permissions;
  majors: Major[];
  onAddMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemoveMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemovePermissions: (permissions: Permissions) => void;
  onUpdateMajorEditPermissionExpirationDate: (
    permissions: Permissions,
    major: Major,
    expirationDate: Date,
  ) => void;
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
          {permissions.majorEditingPermissions.map((majorEditPerm, index) => {
            const major = majorEditPerm.major;

            return (
              <ListItem key={index}>
                <ListItemContent>
                  <Card
                    variant="plain"
                    size="sm"
                    className="flex flex-row gap-1 items-center justify-between p-1"
                  >
                    <div className="flex flex-row gap-1 items-center justify-between w-full">
                      <Typography>
                        {major.name} {major.catalogYear}
                      </Typography>
                      <div className="flex flex-row gap-1 items-center justify-start">
                        <ExpirationLabel
                          expirationDate={majorEditPerm.expirationDate}
                        />
                        <MaterialCssVarsProvider
                          theme={{ [THEME_ID]: materialTheme }}
                        >
                          <CssBaseline enableColorScheme />
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <div className="bg-white dark:bg-secondary-800 rounded-md">
                              <DatePicker
                                value={majorEditPerm.expirationDate}
                                slotProps={{ textField: { size: "small" } }}
                                onChange={(date) =>
                                  onUpdateMajorEditPermissionExpirationDate(
                                    permissions,
                                    major,
                                    date!,
                                  )
                                }
                              />
                            </div>
                          </LocalizationProvider>
                        </MaterialCssVarsProvider>
                      </div>
                    </div>
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

function ExpirationLabel({ expirationDate }: { expirationDate: Date }) {
  const daysTilExpirationDate = Math.floor(
    (expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const expired = daysTilExpirationDate < 0;

  return (
    <Chip variant="soft" color={expired ? "danger" : "neutral"}>
      {expired ? (
        <Typography>
          Expired {Math.abs(daysTilExpirationDate)} days ago
        </Typography>
      ) : (
        <Typography>Expires in {daysTilExpirationDate} days</Typography>
      )}
    </Chip>
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
