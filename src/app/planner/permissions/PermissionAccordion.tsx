import {
  useDeleteUserPermissionMutation,
  usePermissions,
  useUnqiuePrograms,
  useUpdateUserPermissionMutation,
  useUserPermissions,
} from "@/app/hooks/reactQuery";
import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";
import { isProgramAlreadyAdded } from "@/lib/permissionsUtils";
import {
  addNewProgramToPermissions,
  removeProgramFromPermissions,
  updateProgramExpirationDate,
} from "@/lib/permissionsUtils";
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

import CloseIconButton from "../../components/buttons/CloseIconButton";
import ConfirmAlert from "../../components/modals/ConfirmAlert";
import StyledAccordion from "../../components/planner/StyledAccordion";

const materialTheme = extendMaterialTheme();

export interface PermissionsAccordionProps {
  permission: Permission;
}

export default function PermissionsAccordion({
  permission,
}: PermissionsAccordionProps) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Modal State
  const [permissionsAlertOpen, setPermissionsAlertOpen] = useState(false);
  const [permissionToRemove, setPermissionToRemove] =
    useState<Permission | null>(null);

  // Subscribe to query loading states (for loading spinners)
  const { isPending: getPermissionsPending } = usePermissions();
  const { isPending: getUserPermissionsPending } = useUserPermissions(userId);

  // Update and delete permission mutations
  const {
    mutate: updatePermissionMutation,
    isPending: upsertPermissionPending,
  } = useUpdateUserPermissionMutation();

  const {
    mutate: deleteUserPermissionMutation,
    isPending: removePermissionPending,
  } = useDeleteUserPermissionMutation();

  const isLoading =
    getPermissionsPending ||
    getUserPermissionsPending ||
    upsertPermissionPending ||
    removePermissionPending;

  // handlers

  function handleOpenRemovePermissionModal(permission: Permission) {
    setPermissionToRemove(permission);
    setPermissionsAlertOpen(true);
  }

  function handleAddProgramEditPermission(
    permission: Permission,
    program: Program,
  ) {
    if (isProgramAlreadyAdded(program, permission)) return;

    const _permission = addNewProgramToPermissions(program, permission);

    updatePermissionMutation({
      userId: userId!,
      permission: _permission,
    });
  }

  function handleRemoveMajorEditPermission(
    permission: Permission,
    program: Program,
  ) {
    const _permission = removeProgramFromPermissions(program.name, permission);

    updatePermissionMutation({
      userId: userId!,
      permission: _permission,
    });
  }

  function handleUpdateMajorEditPermissionExpirationDate(
    permission: Permission,
    program: Program,
    expirationDate: Date,
  ) {
    const _permission = updateProgramExpirationDate(
      program,
      expirationDate,
      permission,
    );

    updatePermissionMutation({
      userId: userId!,
      permission: _permission,
    });
  }

  return (
    <>
      <ConfirmAlert
        open={permissionsAlertOpen}
        onClose={() => setPermissionsAlertOpen(false)}
        onConfirm={() =>
          deleteUserPermissionMutation({
            userId: userId!,
            userEmail: permissionToRemove!.userEmail,
          })
        }
        dialogText="Are you sure you want remove this permission?"
      />

      <StyledAccordion>
        <AccordionSummary>
          <div className="flex flex-row ml-2 gap-1 items-center justify-between w-full">
            <Typography>{permission.userEmail}</Typography>
            <Button
              color="danger"
              onClick={() => handleOpenRemovePermissionModal(permission)}
              loading={isLoading}
            >
              Remove
            </Button>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {permission.majorEditingPermissions.map(
              (programEditPerm, index) => {
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
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <div className="bg-white dark:bg-secondary-800 rounded-md">
                                  <DatePicker
                                    value={programEditPerm.expirationDate}
                                    slotProps={{ textField: { size: "small" } }}
                                    onChange={(date) =>
                                      handleUpdateMajorEditPermissionExpirationDate(
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
                            handleRemoveMajorEditPermission(permission, program)
                          }
                        />
                      </Card>
                    </ListItemContent>
                  </ListItem>
                );
              },
            )}
          </List>
          <SelectProgram
            permission={permission}
            onAddProgramEditPermission={handleAddProgramEditPermission}
          />
        </AccordionDetails>
      </StyledAccordion>
    </>
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
  permission,
  onAddProgramEditPermission,
}: {
  permission: Permission;
  onAddProgramEditPermission: (permission: Permission, major: Program) => void;
}) {
  const { data: programs } = useUnqiuePrograms();

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
      disabled={programs && programs.length == 0}
    >
      {programs &&
        programs.map((program, index) => (
          <Option key={index} value={program}>
            {program.name} {program.programType == "Minor" ? "(Minor)" : ""}
          </Option>
        ))}
    </Select>
  );
}
