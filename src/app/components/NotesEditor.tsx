import { EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NotesEditor({
  content,
  onUpdateNotes,
}: {
  content: string;
  onUpdateNotes: (content: string) => void;
}) {
  const editor = new Editor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl border rounded-md p-2 min-h-[200px]",
      },
    },
    content: content,
    onBlur({ editor }) {
      onUpdateNotes(editor.getHTML());
    },
  });

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
}
