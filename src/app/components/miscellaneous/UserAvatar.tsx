import { Avatar } from "@mui/joy";

export default function UserAvatar({
  image,
}: {
  image: string | null | undefined;
}) {
  if (!image) return <Avatar size="sm" />;
  return <Avatar src={image} size="sm" />;
}
