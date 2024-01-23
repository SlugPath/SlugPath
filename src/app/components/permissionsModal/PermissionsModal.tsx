import {
  Button,
  Input,
  Modal,
  ModalClose,
  Sheet,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemContent,
  Select,
  Option,
  Card,
  AccordionGroup,
  AccordionSummary,
  AccordionDetails,
} from "@mui/joy";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { SyntheticEvent, useContext, useState } from "react";
import { z } from "zod";
import ReportIcon from "@mui/icons-material/Report";
import useMajors from "@/app/hooks/useMajors";
import { Major } from "@/app/types/Major";
import CloseIconButton from "../CloseIconButton";
import { Permissions } from "@/app/types/Permissions";
import usePermissions from "@/app/hooks/usePermissions";
import StyledAccordion from "../planner/StyledAccordion";
import ConfirmAlert from "../ConfirmAlert";
import { CircularProgress } from "@mui/material";
import IsSatisfiedMark from "../IsSatisfiedMark";

export default function PermissionsModal() {
  const { showPermissionsModal, setShowPermissionsModal } =
    useContext(ModalsContext);

  const [email, setEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const {
    loading: loadingPermissions,
    isSaved,
    permissionsList,
    onSetPermissionsList,
    onSavePermissions,
  } = usePermissions();

  const [permissionsAlertOpen, setPermissionsAlertOpen] =
    useState<boolean>(false);
  const [permissionsToRemove, setPermissionsToRemove] =
    useState<Permissions | null>(null);

  function handleAddUser() {
    if (selectionIsValid()) {
      onSetPermissionsList([
        ...permissionsList,
        { userEmail: email, majorsAllowedToEdit: [] },
      ]);
      setEmail("");
    } else {
      setErrorMsg("Invalid email");
    }
  }

  function handleConfirmRemovePermissions(permissions: Permissions) {
    setPermissionsToRemove(permissions);
    setPermissionsAlertOpen(true);
  }

  function handleRemovePermissions(permissions: Permissions) {
    onSetPermissionsList(
      permissionsList.filter((u) => u.userEmail !== permissions.userEmail),
    );
  }

  function handleAddMajorEditPermission(
    permissions: Permissions,
    major: Major,
  ) {
    if (isMajorAlreadyAdded(permissions, major)) {
      return;
    }
    const permissionsCopy = { ...permissions };
    permissionsCopy.majorsAllowedToEdit.push(major);
    onSetPermissionsList([
      ...permissionsList.filter((p) => p.userEmail !== permissions.userEmail),
      permissionsCopy,
    ]);
  }

  function handleRemoveMajorEditPermission(
    permissions: Permissions,
    major: Major,
  ) {
    const permissionsCopy = { ...permissions };
    permissionsCopy.majorsAllowedToEdit =
      permissionsCopy.majorsAllowedToEdit.filter((m) => m.name !== major.name);
    onSetPermissionsList([
      ...permissionsList.filter((p) => p.userEmail !== permissions.userEmail),
      permissionsCopy,
    ]);
  }

  function isMajorAlreadyAdded(permissions: Permissions, major: Major) {
    return permissions.majorsAllowedToEdit.some(
      (m) => m.name === major.name && m.catalogYear === major.catalogYear,
    );
  }

  function selectionIsValid() {
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(email);
      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <Modal
      open={showPermissionsModal}
      onClose={() => setShowPermissionsModal(false)}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        sx={{
          width: "50%",
          height: "95%",
          margin: 10,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
        className="flex flex-col gap-2"
      >
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
          className="ml-3"
        >
          Permissions Page
        </Typography>
        <div className="flex flex-row gap-2 w-full">
          <div className="flex flex-col mt-2 items-center gap-2 w-full">
            {errorMsg.length > 0 ? (
              <Alert color="danger" startDecorator={<ReportIcon />}>
                {errorMsg}
              </Alert>
            ) : null}
            <div className="flex flex-row gap-1 w-full mr-6 justify-between">
              <div className="flex flex-row gap-1 ml-6">
                <Input
                  variant="soft"
                  value={email}
                  autoFocus
                  placeholder="Email"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddUser();
                    }
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleAddUser}>Add</Button>
              </div>
              <div className="flex flex-row gap-1 items-center">
                <IsSatisfiedMark isSatisfied={isSaved} />
                {loadingPermissions ? (
                  <CircularProgress />
                ) : (
                  <Button
                    disabled={isSaved}
                    color="primary"
                    onClick={onSavePermissions}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
            <PermissionsList
              permissionsList={permissionsList}
              onAddMajorEditPermission={handleAddMajorEditPermission}
              onRemoveMajorEditPermission={handleRemoveMajorEditPermission}
              onRemovePermissions={handleConfirmRemovePermissions}
            />
          </div>
        </div>
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <ConfirmAlert
          open={permissionsAlertOpen}
          onClose={() => setPermissionsAlertOpen(false)}
          onConfirm={() => handleRemovePermissions(permissionsToRemove!)}
          dialogText="Are you sure you want remove this permission?"
        />
      </Sheet>
    </Modal>
  );
}

function PermissionsList({
  permissionsList,
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
}: {
  permissionsList: Permissions[];
  onAddMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemoveMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemovePermissions: (permissions: Permissions) => void;
}) {
  const { majors } = useMajors();

  return (
    <AccordionGroup className="w-full h-[70vh] overflow-auto">
      <List className="flex flex-col gap-1">
        {permissionsList.map((permissions, index) => (
          <ListItem key={index}>
            <ListItemContent>
              <PermissionsAccordion
                permissions={permissions}
                majors={majors}
                onAddMajorEditPermission={onAddMajorEditPermission}
                onRemoveMajorEditPermission={onRemoveMajorEditPermission}
                onRemovePermissions={onRemovePermissions}
              />
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </AccordionGroup>
  );
}

function PermissionsAccordion({
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
