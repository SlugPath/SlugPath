// import { getPastEnrollmentInfo } from "@/app/actions/enrollment";
import { ModalsContext } from "@contexts/ModalsProvider";
import { PermissionsContext } from "@contexts/PermissionsProvider";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SchoolIcon from "@mui/icons-material/School";
import { Button, Card, Typography } from "@mui/joy";
// import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useContext } from "react";

export default function PlannerActions() {
  const {
    setShowMajorSelectionModal,
    setShowMajorProgressModal,
    setShowPermissionsModal,
  } = useContext(ModalsContext);
  const { isAdmin } = useContext(PermissionsContext);
  const { status } = useSession();

  // const { data: enrollInfo } = useQuery({
  //   queryKey: ["getCurrentEnroll"],
  //   queryFn: async () =>
  //     await getPastEnrollmentInfo({ number: "30", departmentCode: "CSE" }),
  // });

  const buttons = [
    {
      name: "Edit Major",
      icon: <EditIcon fontSize="large" />,
      onClick: () => setShowMajorSelectionModal(true),
      disabled: status !== "authenticated",
    },
    {
      name: "Major Progress",
      icon: <SchoolIcon fontSize="large" />,
      onClick: () => setShowMajorProgressModal(true),
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
      {/* <Card>
        <Typography>{JSON.stringify(enrollInfo, null, 2)}</Typography>
      </Card> */}
    </Card>
  );
}
