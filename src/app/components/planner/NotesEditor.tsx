import { debounce } from "lodash";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";

export interface NotesEditorProps {
  content: string;
  onUpdateNotes: (content: string) => void;
  readOnly?: boolean;
}

export default function NotesEditor({
  content,
  onUpdateNotes,
  readOnly,
}: NotesEditorProps) {
  const [text, setText] = useState(content);

  const handleChange = debounce((value: string) => {
    setText(value);
  }, 300);

  useEffect(() => {
    onUpdateNotes(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const toolbarOptions = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3] }],
      ["bold", "italic", "underline", "strike", "link"],
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
    <ReactQuill
      modules={toolbarOptions}
      theme={readOnly ? "bubble" : "snow"}
      defaultValue={text}
      onChange={handleChange}
      readOnly={readOnly}
    />
  );
}
