import { Avatar } from "@mui/joy";

export const USER_AVATAR_DEFAULT_IMAGE = "/images/user-avatar-placeholder.png";

export default function UserAvatar({
  image,
}: {
  image: string | null | undefined;
}) {
  if (!image) return <Avatar size="sm" />;
  return <Avatar src={image} size="sm" />;
}
