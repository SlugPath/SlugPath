import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteForever from "@mui/icons-material/DeleteForever";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import IosShareIcon from "@mui/icons-material/IosShare";
import MoreVert from "@mui/icons-material/MoreVert";
import Dropdown from "@mui/joy/Dropdown";
import ListDivider from "@mui/joy/ListDivider";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import * as React from "react";

interface DropDownButtonProps {
  id: string;
  title: string;
  onDeleteButtonClick: (id: string, title: string) => void;
}

export default function DropDownButton({
  id,
  title,
  onDeleteButtonClick,
}: DropDownButtonProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (event: React.SyntheticEvent | null, isOpen: boolean) => {
      setOpen(isOpen);
    },
    [],
  );

  return (
    <Dropdown open={open} onOpenChange={handleOpenChange}>
      <MenuButton
        slots={{ root: ArrowDropDownIcon }}
        slotProps={{ root: { variant: "plain", color: "neutral" } }}
        sx={{
          "&:focus": {
            backgroundColor: "transparent",
            outline: "none",
          },
          borderRadius: "50%",
        }}
      >
        <MoreVert />
      </MenuButton>
      <Menu placement="bottom-end">
        <MenuItem onClick={() => alert("Rename Button Pressed")}>
          <ListItemDecorator>
            <DriveFileRenameOutlineIcon />
          </ListItemDecorator>{" "}
          Rename
        </MenuItem>
        <MenuItem onClick={() => alert("Duplicate Button Pressed")}>
          <ListItemDecorator>
            <ContentCopyIcon />
          </ListItemDecorator>{" "}
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => alert("Download Button Pressed")}>
          <ListItemDecorator>
            <DownloadIcon />
          </ListItemDecorator>{" "}
          Download
        </MenuItem>
        <MenuItem onClick={() => alert("Share Button Pressed")}>
          <ListItemDecorator>
            <IosShareIcon />
          </ListItemDecorator>{" "}
          Share
        </MenuItem>
        <ListDivider />
        <MenuItem
          variant="soft"
          color="danger"
          onClick={() => onDeleteButtonClick(id, title)} // Call onDeleteButtonClick with id and title
        >
          <ListItemDecorator sx={{ color: "inherit" }}>
            <DeleteForever />
          </ListItemDecorator>{" "}
          Delete
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
