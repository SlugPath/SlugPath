import { debounce } from "lodash";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
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

  const handleChange = debounce((value: string) => {
    setText(value);
  }, 300);

  useEffect(() => {
    onUpdateNotes(text);
  }, [text, onUpdateNotes]);

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
        defaultValue={text}
        onChange={handleChange}
      />
    </div>
  );
}
