import { EditorContent, useEditor } from "@tiptap/react";
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

  if (!editor) {
    return null;
  }

  // Prevent default button action and apply formatting
  const applyFormatting = (
    event: React.MouseEvent,
    formattingFunction: () => void,
  ) => {
    event.preventDefault(); // Prevent the button from losing focus
    formattingFunction();
  };

  const buttonBaseClasses =
    "px-2 py-1 text-sm font-medium rounded transition-colors duration-150";
  const activeClasses = "bg-blue-500 text-white hover:bg-blue-600";
  const inactiveClasses = "bg-gray-200 text-gray-800 hover:bg-gray-300";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <div className="border-1 border-red-50 h-full">
      <button
        onMouseDown={(event) =>
          applyFormatting(event, () =>
            editor.chain().focus().toggleBold().run(),
          )
        }
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`${buttonBaseClasses} ${
          editor.isActive("bold") ? activeClasses : inactiveClasses
        }`}
      >
        Bold
      </button>
      <button
        onMouseDown={(event) =>
          applyFormatting(event, () =>
            editor.chain().focus().toggleItalic().run(),
          )
        }
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`${buttonBaseClasses} ${
          editor.isActive("italic") ? activeClasses : inactiveClasses
        }`}
      >
        Italic
      </button>
      <button
        onMouseDown={(event) =>
          applyFormatting(event, () => editor.chain().focus().undo().run())
        }
        disabled={!editor.can().chain().focus().undo().run()}
        className={`${buttonBaseClasses} ${
          !editor.can().undo() ? disabledClasses : inactiveClasses
        }`}
      >
        Undo
      </button>
      <button
        onMouseDown={(event) =>
          applyFormatting(event, () => editor.chain().focus().redo().run())
        }
        disabled={!editor.can().chain().focus().redo().run()}
        className={`${buttonBaseClasses} ${
          !editor.can().redo() ? disabledClasses : inactiveClasses
        }`}
      >
        Redo
      </button>

      <div className="border p-4 space-y-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
