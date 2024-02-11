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
import React, { useEffect } from "react";

interface DropDownButtonProps {
  id: string;
  title: string;
  onDeleteButtonClick: (id: string, title: string) => void;
  onDuplicateButtonClick: () => void;
  onRenameButtonClick: () => void;
  onRightClick: boolean;
  dropDownClosed: (isClosed: boolean) => void;
}

export default function DropDownButton({
  id,
  title,
  onDeleteButtonClick,
  onDuplicateButtonClick,
  onRenameButtonClick,
  onRightClick,
  dropDownClosed,
}: DropDownButtonProps) {
  const [open, setOpen] = React.useState(false);
  //console.log("open: ", open);
  //console.log("onRightClick: ", onRightClick);

  const handleOpenChange = React.useCallback(
    (event: React.SyntheticEvent | null, isOpen: boolean) => {
      //console.log("isOpen:", isOpen);
      setOpen(isOpen);
      if (isOpen == false) {
        dropDownClosed(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (onRightClick) {
      setOpen(true);
    }
  }, [onRightClick]);

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
        <MenuItem onClick={onRenameButtonClick}>
          <ListItemDecorator>
            <DriveFileRenameOutlineIcon />
          </ListItemDecorator>{" "}
          Rename
        </MenuItem>
        <MenuItem onClick={onDuplicateButtonClick}>
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
