import { Chip, Tooltip, Typography } from "@mui/joy";

export type ShortcutTooltipProps = {
  title: string;
  shortcut: string;
  children: React.ReactElement;
};

export default function ShortcutTooltip({
  title,
  shortcut,
  children,
}: ShortcutTooltipProps) {
  const lead = window.navigator.userAgent === "Win32" ? "Ctrl" : "⌘"; // TODO: is this the right way to check for platform
  return (
    <Tooltip
      arrow
      title={
        <Typography level="body-sm">
          <span className="text-white">{title}</span>
          <Chip size="sm" color="neutral" className="ml-2">
            {lead} + {shortcut}
          </Chip>
        </Typography>
      }
      variant="solid"
      color="primary"
    >
      {children}
    </Tooltip>
  );
}
