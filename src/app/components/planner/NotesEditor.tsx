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

    // Disable the eslint rule to prevent rerendering when onUpdateNotes changes
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
    <div className="mb-2 h-96">
      <ReactQuill
        modules={toolbarOptions}
        style={{ height: "80%" }}
        theme={readOnly ? "bubble" : "snow"}
        defaultValue={text}
        onChange={handleChange}
        readOnly={readOnly}
      />
    </div>
  );
}
