import { IconButton } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

export default function CloseIconButton({
  onClick,
  sx,
}: {
  onClick: () => void;
  sx?: any;
}) {
  return (
    <IconButton
      onClick={onClick}
      variant="plain"
      size="sm"
      sx={{
        "&:hover": {
          backgroundColor: "transparent",
        },
        borderRadius: "50%",
        ...sx,
      }}
    >
      <CloseIcon
        fontSize="small"
        sx={{
          "&:hover": {
            opacity: 0.2,
          },
        }}
      />
    </IconButton>
  );
}
