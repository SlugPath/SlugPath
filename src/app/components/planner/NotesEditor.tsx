import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";

export interface NotesEditorProps {
  content: string;
  onUpdateNotes: (content: string) => void;
}

export default function NotesEditor({
  content,
  onUpdateNotes,
}: NotesEditorProps) {
  const [text, setText] = useState(content);

  const handleChange = (value: string) => {
    setText(value);
    onUpdateNotes(value);
  };

  const toolbarOptions = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
      ["clean"],
    ],
  };

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    [],
  );

  return (
    <div className="m-4 min-h-[400px]">
      <ReactQuill
        modules={toolbarOptions}
        style={{ height: "20rem", border: "none" }}
        theme="snow"
        value={text}
        onChange={handleChange}
      />
    </div>
  );
}
