import { Edit } from "@mui/icons-material";
import { IconButton, Input, Typography } from "@mui/joy";
import { useEffect, useState } from "react";

export default function EditableTitle({
  title,
  onChange,
  placeholder,
}: {
  title: string;
  onChange: (title: string) => void;
  placeholder: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(title);

  useEffect(() => {
    if (!isEditing) {
      onChange(text);
    }
  }, [isEditing, text, onChange]);

  function toggleEditing() {
    setIsEditing(!isEditing);
  }

  return (
    <>
      {isEditing ? (
        <Input
          variant="soft"
          value={text}
          autoFocus
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              toggleEditing();
            }
          }}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <div>
          <Typography>{title}</Typography>
          <IconButton onClick={toggleEditing}>
            <Edit />
          </IconButton>
        </div>
      )}
    </>
  );
}
