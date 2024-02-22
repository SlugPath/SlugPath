import { ModalsContext } from "@contexts/ModalsProvider";
import { PermissionsContext } from "@contexts/PermissionsProvider";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SchoolIcon from "@mui/icons-material/School";
import { Button, Card, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useContext } from "react";

export default function PlannerActions() {
  const { setShowMajorsModal, setShowPermissionsModal } =
    useContext(ModalsContext);
  const { isAdmin } = useContext(PermissionsContext);
  const { status } = useSession();

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
  );
}
