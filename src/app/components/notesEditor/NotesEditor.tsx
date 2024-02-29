import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [StarterKit];

export interface NotesEditorProps {
  content: string;
  onUpdateNotes: (content: string) => void;
  readOnly?: boolean;
}

export default function NotesEditor({
  content,
  onUpdateNotes,
}: NotesEditorProps) {
  const editor = useEditor(
    {
      extensions,
      content,
      onBlur: ({ editor }) => {
        onUpdateNotes(editor.getHTML());
      },
    },
    [content],
  );

  return (
    <div className="border-1 border-red-50 h-full">
      <FloatingMenu editor={editor!}> Floating menu </FloatingMenu>
      <BubbleMenu editor={editor!}> Bubble menu </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}
