import { List, ListItem, ListItemContent, AccordionGroup } from "@mui/joy";
import useMajors from "@/app/hooks/useMajors";
import { Major } from "@/app/types/Major";
import { Permissions } from "@/app/types/Permissions";
import PermissionsAccordion from "./PermissionsAccordion";

export default function PermissionsList({
  permissionsList,
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
  onUpdateMajorEditPermissionExpirationDate,
}: {
  permissionsList: Permissions[];
  onAddMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemoveMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemovePermissions: (permissions: Permissions) => void;
  onUpdateMajorEditPermissionExpirationDate: (
    permissions: Permissions,
    major: Major,
    expirationDate: Date,
  ) => void;
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
                onUpdateMajorEditPermissionExpirationDate={
                  onUpdateMajorEditPermissionExpirationDate
                }
              />
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </AccordionGroup>
  );
}
