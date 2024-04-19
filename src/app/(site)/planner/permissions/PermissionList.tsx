import { usePermissions } from "@/app/hooks/reactQuery";
import { sortPermissions } from "@/lib/permissionsUtils";
import { AccordionGroup, List, ListItem, ListItemContent } from "@mui/joy";
import { lazy } from "react";

const PermissionAccordion = lazy(() => import("./PermissionAccordion"));

export default function PermissionsList() {
  const { data: permissions } = usePermissions(sortPermissions);

  return (
    <AccordionGroup className="w-full h-[70vh] overflow-auto">
      <List className="flex flex-col gap-1">
        {permissions?.map((permission, index) => (
          <ListItem key={index}>
            <ListItemContent>
              <PermissionAccordion permission={permission} />
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </AccordionGroup>
  );
}
