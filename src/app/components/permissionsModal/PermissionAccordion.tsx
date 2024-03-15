import {
  useDeleteUserPermissionMutation,
  usePermissions,
  useUpdateUserPermissionMutation,
  useUserPermissions,
} from "@/app/hooks/reactQuery";
import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";
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
import { useSession } from "next-auth/react";
import { SyntheticEvent, useState } from "react";

import CloseIconButton from "../buttons/CloseIconButton";
import StyledAccordion from "../planner/StyledAccordion";

const materialTheme = extendMaterialTheme();

export interface PermissionsAccordionProps {
  permission: Permission;
  programs: Program[];
  onAddMajorEditPermission: (permission: Permission, major: Program) => void;
  onRemoveMajorEditPermission: (permission: Permission, major: Program) => void;
  onRemovePermissions: (permission: Permission) => void;
  onUpdateMajorEditPermissionExpirationDate: (
    permission: Permission,
    major: Program,
    expirationDate: Date,
  ) => void;
}

// TODO: eliminate prop drilling (use react query hooks)
export default function PermissionsAccordion({
  permission,
  programs,
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
  onUpdateMajorEditPermissionExpirationDate,
}: PermissionsAccordionProps) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Subscribe to query loading states for permissions
  const { isPending: getPermissionsPending } = usePermissions();
  const { isPending: getUserPermissionsPending } = useUserPermissions(userId);
  const { isPending: upsertPermissionPending } =
    useUpdateUserPermissionMutation();
  const { isPending: removePermissionPending } =
    useDeleteUserPermissionMutation();

  const isLoading =
    getPermissionsPending ||
    getUserPermissionsPending ||
    upsertPermissionPending ||
    removePermissionPending;

  return (
    <StyledAccordion>
      <AccordionSummary>
        <div className="flex flex-row ml-2 gap-1 items-center justify-between w-full">
          <Typography>{permission.userEmail}</Typography>
          <Button
            color="danger"
            onClick={() => onRemovePermissions(permission)}
            loading={isLoading}
          >
            Remove
          </Button>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {permission.majorEditingPermissions.map((programEditPerm, index) => {
            const program = programEditPerm.major;

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
                        {program.name}{" "}
                        {program.programType == "Minor" ? "(Minor)" : ""}
                      </Typography>
                      <div className="flex flex-row gap-1 items-center justify-start">
                        <ExpirationLabel
                          expirationDate={programEditPerm.expirationDate}
                        />
                        <MaterialCssVarsProvider
                          theme={{ [THEME_ID]: materialTheme }}
                        >
                          <CssBaseline enableColorScheme />
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <div className="bg-white dark:bg-secondary-800 rounded-md">
                              <DatePicker
                                value={programEditPerm.expirationDate}
                                slotProps={{ textField: { size: "small" } }}
                                onChange={(date) =>
                                  onUpdateMajorEditPermissionExpirationDate(
                                    permission,
                                    program,
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
                        onRemoveMajorEditPermission(permission, program)
                      }
                    />
                  </Card>
                </ListItemContent>
              </ListItem>
            );
          })}
        </List>
        <SelectProgram
          programs={programs}
          permission={permission}
          onAddProgramEditPermission={onAddMajorEditPermission}
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

function SelectProgram({
  programs,
  permission,
  onAddProgramEditPermission,
}: {
  programs: Program[];
  permission: Permission;
  onAddProgramEditPermission: (permission: Permission, major: Program) => void;
}) {
  const [value, setValue] = useState<Program | null>(null);

  function onChange(
    _: SyntheticEvent<Element, Event> | null,
    newValue: Program | null,
  ) {
    if (newValue) {
      onAddProgramEditPermission(permission, newValue);
      setValue(null);
    }
  }

  return (
    <Select
      value={value}
      placeholder="Add a program..."
      variant="plain"
      onChange={onChange}
      disabled={programs.length == 0}
    >
      {programs.map((program, index) => (
        <Option key={index} value={program}>
          {program.name} {program.programType == "Minor" ? "(Minor)" : ""}
        </Option>
      ))}
    </Select>
  );
}
