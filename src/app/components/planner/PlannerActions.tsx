import { useUserRole } from "@/app/hooks/reactQuery";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SchoolIcon from "@mui/icons-material/School";
import { Button, Card, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useState } from "react";

import MajorsModal from "../modals/majorsModal/MajorsModal";
import PermissionsModal from "../permissionsModal/PermissionsModal";

export default function PlannerActions() {
  const { data: session, status } = useSession();

  // Modal state
  const [showMajorsModal, setShowMajorsModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  // Fetch user role
  const { data: userRole } = useUserRole(session?.user.id);
  const isAdmin = userRole === "ADMIN";

  const buttons = [
    {
      name: "Majors",
      icon: <SchoolIcon fontSize="large" />,
      onClick: () => setShowMajorsModal(true),
      disabled: status !== "authenticated",
    },
  ];

  if (isAdmin) {
    buttons.push({
      name: "Permissions",
      icon: <LockOpenIcon fontSize="large" />,
      onClick: () => setShowPermissionsModal(true),
      disabled: false,
    });
  }

  return (
    <>
      <MajorsModal
        showModal={showMajorsModal}
        setShowModal={setShowMajorsModal}
      />
      <PermissionsModal
        showModal={showPermissionsModal}
        setShowModal={setShowPermissionsModal}
      />

      <Card variant="plain" className="flex flex-col gap-1">
        {buttons.map((button, index) => (
          <Button
            onClick={button.onClick}
            variant="plain"
            key={index}
            startDecorator={button.icon}
            disabled={button.disabled}
          >
            <Typography>{button.name}</Typography>
          </Button>
        ))}
      </Card>
    </>
  );
}
