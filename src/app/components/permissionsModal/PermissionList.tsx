import { Permission } from "@/app/types/Permission";
import { Major } from "@customTypes/Major";
import { AccordionGroup, List, ListItem, ListItemContent } from "@mui/joy";
import { lazy } from "react";

import useMajors from "./useMajors";

const PermissionAccordion = lazy(() => import("./PermissionAccordion"));

export interface PermissionsProps {
  permissions: Permission[];
  onAddMajorEditPermission: (permission: Permission, major: Major) => void;
  onRemoveMajorEditPermission: (permission: Permission, major: Major) => void;
  onRemovePermissions: (permission: Permission) => void;
  onUpdateMajorEditPermissionExpirationDate: (
    permission: Permission,
    major: Major,
    expirationDate: Date,
  ) => void;
}

export default function PermissionsList({
  permissions,
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
  onUpdateMajorEditPermissionExpirationDate,
}: PermissionsProps) {
  const { majors } = useMajors();

  return (
    <AccordionGroup className="w-full h-[70vh] overflow-auto">
      <List className="flex flex-col gap-1">
        {permissions.map((permission, index) => (
          <ListItem key={index}>
            <ListItemContent>
              <PermissionAccordion
                permission={permission}
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
