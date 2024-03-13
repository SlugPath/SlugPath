import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";
import { ModalsContext } from "@contexts/ModalsProvider";
import { PermissionsContext } from "@contexts/PermissionsProvider";
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

import IsSatisfiedMark from "../miscellaneous/IsSatisfiedMark";
import ConfirmAlert from "../modals/ConfirmAlert";
import PermissionList from "./PermissionList";

export default function PermissionsModal() {
  const { showPermissionsModal, setShowPermissionsModal } =
    useContext(ModalsContext);

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const {
    permissions,
    loadingPermissions,
    isSaved,
    onUpsertPermission,
    onRemovePermission,
  } = useContext(PermissionsContext);

  const [permissionsAlertOpen, setPermissionsAlertOpen] = useState(false);
  const [permissionToRemove, setPermissionToRemove] =
    useState<Permission | null>(null);

  // Handlers
  function handleAddUser() {
    if (selectionIsValid()) {
      onUpsertPermission({ userEmail: email, majorEditingPermissions: [] });
      setEmail("");
    } else {
      setErrorMsg("Invalid email or email has already been added");
    }
  }

  function handleConfirmRemovePermissions(permission: Permission) {
    setPermissionToRemove(permission);
    setPermissionsAlertOpen(true);
  }

  function handleRemovePermissions(permission: Permission) {
    onRemovePermission(permission.userEmail);
  }

  function handleAddMajorEditPermission(
    permission: Permission,
    major: Program,
  ) {
    if (isMajorAlreadyAdded(permission, major)) {
      return;
    }

    const permissionsCopy = { ...permission };
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14);
    permissionsCopy.majorEditingPermissions.push({
      major: major,
      expirationDate,
    });
    onUpsertPermission(permissionsCopy);
  }

  function handleRemoveMajorEditPermission(
    permission: Permission,
    major: Program,
  ) {
    const permissionsCopy = { ...permission };
    permissionsCopy.majorEditingPermissions =
      permissionsCopy.majorEditingPermissions.filter((majorEditPerm) => {
        const otherMajor = majorEditPerm.major;
        return otherMajor.name !== major.name;
      });
    onUpsertPermission(permissionsCopy);
  }

  function handleUpdateMajorEditPermissionExpirationDate(
    permission: Permission,
    major: Program,
    expirationDate: Date,
  ) {
    const permissionsCopy = { ...permission };
    permissionsCopy.majorEditingPermissions =
      permissionsCopy.majorEditingPermissions.map((majorEditPerm) => {
        const otherMajor = majorEditPerm.major;
        if (
          otherMajor.name === major.name &&
          otherMajor.catalogYear === major.catalogYear
        ) {
          return {
            major: otherMajor,
            expirationDate: expirationDate,
          };
        } else {
          return majorEditPerm;
        }
      });
    onUpsertPermission(permissionsCopy);
  }

  // Helpers
  function isUserAlreadyAdded(email: string) {
    return permissions.some((p) => p.userEmail === email);
  }

  function isMajorAlreadyAdded(permission: Permission, major: Program) {
    return permission.majorEditingPermissions.some((m) => {
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
                {loadingPermissions && <CircularProgress />}
              </div>
            </div>
            <PermissionList
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
          onConfirm={() => handleRemovePermissions(permissionToRemove!)}
          dialogText="Are you sure you want remove this permission?"
        />
      </Sheet>
    </Modal>
  );
}
