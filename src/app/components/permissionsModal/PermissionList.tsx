import { PermissionsContext } from "@/app/contexts/PermissionsProvider/Provider";
import useMajors from "@/app/hooks/useMajors";
import { Permission } from "@/app/types/Permission";
import { Major } from "@customTypes/Major";
import { AccordionGroup, List, ListItem, ListItemContent } from "@mui/joy";
import { lazy, useContext } from "react";

const PermissionAccordion = lazy(() => import("./PermissionAccordion"));

export interface PermissionsProps {
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
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
  onUpdateMajorEditPermissionExpirationDate,
}: PermissionsProps) {
  const { majors } = useMajors();
  const { permissions } = useContext(PermissionsContext);

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
