import { Major } from "@customTypes/Major";
import { Permissions } from "@customTypes/Permissions";
import { AccordionGroup, List, ListItem, ListItemContent } from "@mui/joy";
import { lazy } from "react";

import useMajors from "./useMajors";

const PermissionsAccordion = lazy(() => import("./PermissionsAccordion"));

export interface PermissionsListProps {
  permissionsList: Permissions[];
  onAddMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemoveMajorEditPermission: (permissions: Permissions, major: Major) => void;
  onRemovePermissions: (permissions: Permissions) => void;
  onUpdateMajorEditPermissionExpirationDate: (
    permissions: Permissions,
    major: Major,
    expirationDate: Date,
  ) => void;
}

export default function PermissionsList({
  permissionsList,
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
  onUpdateMajorEditPermissionExpirationDate,
}: PermissionsListProps) {
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
