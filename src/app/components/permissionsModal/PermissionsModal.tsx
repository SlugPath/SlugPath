import usePermissions from "@/app/components/permissionsModal/usePermissions";
import { ModalsContext } from "@/app/contexts/ModalsProvider";
import { Major } from "@/app/types/Major";
import { Permissions } from "@/app/types/Permissions";
import ReportIcon from "@mui/icons-material/Report";
import {
  Alert,
  Button,
  Input,
  Modal,
  ModalClose,
  Sheet,
  Typography,
} from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { z } from "zod";

import IsSatisfiedMark from "../IsSatisfiedMark";
import ConfirmAlert from "../modals/ConfirmAlert";
import PermissionsList from "./PermissionsList";

export default function PermissionsModal() {
  const { showPermissionsModal, setShowPermissionsModal } =
    useContext(ModalsContext);

  const [email, setEmail] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const {
    isPending: loadingPermissions,
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
        { userEmail: email, majorEditingPermissions: [] },
      ]);
      setEmail("");
    } else {
      setErrorMsg("Invalid email or email has already been added");
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
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14);
    permissionsCopy.majorEditingPermissions.push({
      major: major,
      expirationDate,
    });
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
    permissionsCopy.majorEditingPermissions =
      permissionsCopy.majorEditingPermissions.filter((majorEditPerm) => {
        const otherMajor = majorEditPerm.major;
        return (
          otherMajor.name !== major.name ||
          otherMajor.catalogYear !== major.catalogYear
        );
      });
    onSetPermissionsList([
      ...permissionsList.filter((p) => p.userEmail !== permissions.userEmail),
      permissionsCopy,
    ]);
  }

  function handleUpdateMajorEditPermissionExpirationDate(
    permissions: Permissions,
    major: Major,
    expirationDate: Date,
  ) {
    const permissionsCopy = { ...permissions };
    permissionsCopy.majorEditingPermissions =
      permissionsCopy.majorEditingPermissions.map((majorEditPerm) => {
        const otherMajor = majorEditPerm.major;
        if (otherMajor.name === major.name) {
          return {
            major: otherMajor,
            expirationDate: expirationDate,
          };
        } else {
          return majorEditPerm;
        }
      });
    onSetPermissionsList([
      ...permissionsList.filter((p) => p.userEmail !== permissions.userEmail),
      permissionsCopy,
    ]);
  }

  function isUserAlreadyAdded(email: string) {
    return permissionsList.some((p) => p.userEmail === email);
  }

  function isMajorAlreadyAdded(permissions: Permissions, major: Major) {
    return permissions.majorEditingPermissions.some((m) => {
      const otherMajor = m.major;
      return (
        otherMajor.name === major.name &&
        otherMajor.catalogYear === major.catalogYear
      );
    });
  }

  function selectionIsValid() {
    if (isUserAlreadyAdded(email)) return false;

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
                    onClick={() => {
                      onSavePermissions();
                      setErrorMsg("");
                    }}
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
              onUpdateMajorEditPermissionExpirationDate={
                handleUpdateMajorEditPermissionExpirationDate
              }
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
