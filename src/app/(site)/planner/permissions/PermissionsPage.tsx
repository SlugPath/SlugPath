"use client";

import PermissionList from "@/app/(site)/planner/permissions/PermissionList";
import { isUserAlreadyAdded, sortPermissions } from "@/lib/permissionsUtils";
import { isValidEmail } from "@/lib/utils";
import IsSatisfiedMark from "@components/miscellaneous/IsSatisfiedMark";
import {
  useDeleteUserPermissionMutation,
  usePermissions,
  useUpdateUserPermissionMutation,
} from "@hooks/reactQuery";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ReportIcon from "@mui/icons-material/Report";
import { Alert, Button, Input, Typography } from "@mui/joy";
import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Permissions() {
  const router = useRouter();
  const session = useSession();
  const userId = session.data?.user.id;

  // Input state
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch permissions
  const { data: permissions, isPending: getPermissionsPending } =
    usePermissions(sortPermissions);

  // Update permissions
  const {
    isPending: updatePermissionMutationPending,
    mutate: updatePermissionMutation,
  } = useUpdateUserPermissionMutation();

  // Delete permissions loading state
  const { isPending: deletePermissionsPending } =
    useDeleteUserPermissionMutation();

  const isPending =
    getPermissionsPending ||
    updatePermissionMutationPending ||
    deletePermissionsPending;

  const isSaved = updatePermissionMutationPending || deletePermissionsPending;

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

  return (
    <>
      <div className="flex flex-row justify-start w-full items-center">
        <Typography
          component="h2"
          level="h3"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
          className="m-3"
          startDecorator={<AdminPanelSettingsIcon />}
        >
          Permissions
        </Typography>
        <Button
          variant="plain"
          onClick={() => router.push("/planner")}
          startDecorator={<KeyboardArrowLeftIcon fontSize="large" />}
          sx={{ width: "fit-content" }}
        >
          Back to Planner
        </Button>
      </div>
      <div className="flex flex-col items-center gap-2 w-full">
        {errorMsg.length > 0 ? (
          <Alert color="danger" startDecorator={<ReportIcon />}>
            {errorMsg}
          </Alert>
        ) : null}
        <div className="flex flex-row gap-1 w-full justify-between">
          <div className="flex flex-row gap-1 ml-3">
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
          <div className="flex flex-row gap-1 items-center mr-3">
            <IsSatisfiedMark isSatisfied={isSaved} />
            {isPending && <CircularProgress />}
          </div>
        </div>
        <PermissionList />
      </div>
    </>
  );
}
