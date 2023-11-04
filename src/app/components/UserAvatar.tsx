import { Avatar } from "@mui/joy";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function UserAvatar({
  src,
  name,
}: {
  src: string | null | undefined;
  name: string | null | undefined;
}) {
  const imgSrc = src ?? "";
  const userName = name ?? "UCSC student";

  if (imgSrc !== "") return <Avatar alt="UCSC student" src={imgSrc} />;

  return <Avatar {...stringAvatar(userName)}></Avatar>;
}
