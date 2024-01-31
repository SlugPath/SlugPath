import { Textarea } from "@mui/joy";
import { useState } from "react";

export interface NotesEditorProps {
  content: string;
  onUpdateNotes: (content: string) => void;
}

export default function NotesEditor({
  content,
  onUpdateNotes,
}: NotesEditorProps) {
  const [text, setText] = useState(content);

  return (
    <Textarea
      minRows={7}
      onBlur={() => onUpdateNotes(text)}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
      }}
      sx={{
        outline: "none",
      }}
      className="border-0"
    />
  );
}
