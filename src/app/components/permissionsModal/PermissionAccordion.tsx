import { PermissionsContext } from "@/app/contexts/PermissionsProvider/Provider";
import { Major } from "@/app/types/Major";
import { Permission } from "@/app/types/Permission";
import {
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Chip,
  List,
  ListItem,
  ListItemContent,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import { CssBaseline } from "@mui/material";
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID,
  experimental_extendTheme as extendMaterialTheme,
} from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { SyntheticEvent, useContext, useState } from "react";

import CloseIconButton from "../buttons/CloseIconButton";
import StyledAccordion from "../planner/StyledAccordion";

const materialTheme = extendMaterialTheme();

export interface PermissionsAccordionProps {
  permission: Permission;
  majors: Major[];
  onAddMajorEditPermission: (permission: Permission, major: Major) => void;
  onRemoveMajorEditPermission: (permission: Permission, major: Major) => void;
  onRemovePermissions: (permission: Permission) => void;
  onUpdateMajorEditPermissionExpirationDate: (
    permission: Permission,
    major: Major,
    expirationDate: Date,
  ) => void;
}
export default function PermissionsAccordion({
  permission,
  majors,
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
  onUpdateMajorEditPermissionExpirationDate,
}: PermissionsAccordionProps) {
  const { loadingPermissions } = useContext(PermissionsContext);

  return (
    <StyledAccordion>
      <AccordionSummary>
        <div className="flex flex-row ml-2 gap-1 items-center justify-between w-full">
          <Typography>{permission.userEmail}</Typography>
          <Button
            color="danger"
            onClick={() => onRemovePermissions(permission)}
            loading={loadingPermissions}
          >
            Remove
          </Button>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {permission.majorEditingPermissions.map((majorEditPerm, index) => {
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
                        {major.name}{" "}
                        {major.programType == "Minor" ? "(Minor)" : ""}
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
                                    permission,
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
                        onRemoveMajorEditPermission(permission, major)
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
          permission={permission}
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
  permission,
  onAddMajorEditPermission,
}: {
  majors: Major[];
  permission: Permission;
  onAddMajorEditPermission: (permission: Permission, major: Major) => void;
}) {
  const [value, setValue] = useState<Major | null>(null);

  function onChange(
    event: SyntheticEvent<Element, Event> | null,
    newValue: Major | null,
  ) {
    if (newValue) {
      onAddMajorEditPermission(permission, newValue);
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
          {major.name} {major.programType == "Minor" ? "(Minor)" : ""}
        </Option>
      ))}
    </Select>
  );
}
