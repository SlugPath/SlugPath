"use client";

import { useUserRole } from "@/app/hooks/reactQuery";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import { Button } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PlannerActions() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const redirectToAdminDashboard = () => router.push("/planner/permissions");

  const { data: userRole } = useUserRole(session?.user.id);
  const isAdmin = userRole === "ADMIN";

  const buttons = [
    {
      name: "Majors",
      icon: <SchoolIcon fontSize="large" sx={{ color: "#fff" }} />,
      onClick: () => router.push("/planner/majors"),
      disabled: status !== "authenticated",
    },
  ];

  if (isAdmin) {
    buttons.push({
      name: "Permissions",
      icon: <AdminPanelSettingsIcon fontSize="large" sx={{ color: "#fff" }} />,
      onClick: () => redirectToAdminDashboard(),
      disabled: false,
    });
  }

  return (
    <div className="flex flex-row">
      {buttons.map((button, index) => (
        <Button
          onClick={button.onClick}
          variant="solid"
          key={index}
          startDecorator={button.icon}
          disabled={button.disabled}
          className="hover:bg-primary-400"
        >
          {button.name}
        </Button>
      ))}
    </div>
  );
}
