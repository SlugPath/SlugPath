import {
  useDeleteUserPermissionMutation,
  usePermissions,
  useUpdateUserPermissionMutation,
} from "@/app/hooks/reactQuery";
import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";
import {
  addNewProgramToPermissions,
  isProgramAlreadyAdded,
  isUserAlreadyAdded,
  removeProgramFromPermissions,
  sortPermissions,
  updateProgramExpirationDate,
} from "@/lib/permissionsUtils";
import { isValidEmail } from "@/lib/utils";
import { ModalsContext } from "@contexts/ModalsProvider";
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
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";

import IsSatisfiedMark from "../miscellaneous/IsSatisfiedMark";
import ConfirmAlert from "../modals/ConfirmAlert";
import PermissionList from "./PermissionList";

export default function PermissionsModal() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Modal context
  const { showPermissionsModal, setShowPermissionsModal } =
    useContext(ModalsContext);

  // Input state
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State
  const [permissionsAlertOpen, setPermissionsAlertOpen] = useState(false);
  const [permissionToRemove, setPermissionToRemove] =
    useState<Permission | null>(null);

  // Fetch permissions
  const { data: permissions, isPending: getPermissionsPending } =
    usePermissions(sortPermissions);

  // Update permissions
  const {
    isPending: updatePermissionMutationPending,
    mutate: updatePermissionMutation,
  } = useUpdateUserPermissionMutation();

  // Delete permissions
  const {
    isPending: deletePermissionsPending,
    mutate: deletePermissionsMutation,
  } = useDeleteUserPermissionMutation();

  const isPending =
    getPermissionsPending ||
    updatePermissionMutationPending ||
    deletePermissionsPending;

  const isSaved = updatePermissionMutationPending || deletePermissionsPending;

  // Handlers

  function handleAddUser() {
    if (isUserAlreadyAdded(email, permissions)) {
      setErrorMsg("Email has already been added");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg("Invalid email");
      return;
    }

    updatePermissionMutation({
      userId: userId!,
      permission: { userEmail: email, majorEditingPermissions: [] },
    });
    setEmail("");
  }

  function handleConfirmRemovePermissions(permission: Permission) {
    setPermissionToRemove(permission);
    setPermissionsAlertOpen(true);
  }

  function handleAddMajorEditPermission(
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
                {isPending && <CircularProgress />}
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
          onConfirm={() =>
            deletePermissionsMutation({
              userId: userId!,
              userEmail: permissionToRemove!.userEmail,
            })
          }
          dialogText="Are you sure you want remove this permission?"
        />
      </Sheet>
    </Modal>
  );
}
