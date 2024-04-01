import { useUserRole } from "@/app/hooks/reactQuery";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SchoolIcon from "@mui/icons-material/School";
import { Button, Card, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PlannerActions() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const redirectToAdminDashboard = () => router.push("planner/permissions");

  const { data: userRole } = useUserRole(session?.user.id);
  const isAdmin = userRole === "ADMIN";

  const buttons = [
    {
      name: "Majors",
      icon: <SchoolIcon fontSize="large" />,
      onClick: () => router.push("/planner/majors"),
      disabled: status !== "authenticated",
    },
  ];

  if (isAdmin) {
    buttons.push({
      name: "Permissions",
      icon: <LockOpenIcon fontSize="large" />,
      onClick: () => redirectToAdminDashboard(),
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
