import { usePermissions, useUnqiuePrograms } from "@/app/hooks/reactQuery";
import { Permission } from "@/app/types/Permission";
import { Program } from "@/app/types/Program";
import { sortPermissions } from "@/lib/permissionsUtils";
import { AccordionGroup, List, ListItem, ListItemContent } from "@mui/joy";
import { lazy } from "react";

const PermissionAccordion = lazy(() => import("./PermissionAccordion"));

export interface PermissionsProps {
  onAddMajorEditPermission: (permission: Permission, major: Program) => void;
  onRemoveMajorEditPermission: (permission: Permission, major: Program) => void;
  onRemovePermissions: (permission: Permission) => void;
  onUpdateMajorEditPermissionExpirationDate: (
    permission: Permission,
    major: Program,
    expirationDate: Date,
  ) => void;
}

export default function PermissionsList({
  onAddMajorEditPermission,
  onRemoveMajorEditPermission,
  onRemovePermissions,
  onUpdateMajorEditPermissionExpirationDate,
}: PermissionsProps) {
  const { data: programs } = useUnqiuePrograms();
  const { data: permissions } = usePermissions(sortPermissions);

  return (
    <AccordionGroup className="w-full h-[70vh] overflow-auto">
      <List className="flex flex-col gap-1">
        {permissions &&
          permissions.map((permission, index) => (
            <ListItem key={index}>
              <ListItemContent>
                <PermissionAccordion
                  permission={permission}
                  programs={programs ?? []}
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
