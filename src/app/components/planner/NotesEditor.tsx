// Core CSS
import "primeicons/primeicons.css";
import { Editor } from "primereact/editor";
// Theme
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useState } from "react";

// Icons

export interface NotesEditorProps {
  content: string;
  onUpdateNotes: (content: string) => void;
}

export default function NotesEditor({
  content,
  onUpdateNotes,
}: NotesEditorProps) {
  const [text, setText] = useState(content);

  const handleTextChange = (e: any) => {
    // The value is in e.htmlValue for PrimeReact Editor
    setText(e.htmlValue);
    onUpdateNotes(e.htmlValue);
  };

  return (
    <Editor
      style={{ height: "320px" }}
      value={text}
      onTextChange={handleTextChange}
    />
  );
}
