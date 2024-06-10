import { Avatar } from "@mui/joy";

export const USER_AVATAR_DEFAULT_IMAGE = "/images/user-avatar-placeholder.png";

export default function UserAvatar({
  image,
  size = "sm", // Default size is "sm" if not provided
}: {
  image: string | null | undefined;
  size?: "sm" | "md" | "lg"; // Define the type for the size parameter
}) {
  if (!image) return <Avatar size={size} />;
  return <Avatar src={image} size={size} />;
}
