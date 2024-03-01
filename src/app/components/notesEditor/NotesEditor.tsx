import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

const extensions = [StarterKit, Underline, Link];

export interface NotesEditorProps {
  content: string;
  onUpdateNotes: (content: string) => void;
  readOnly?: boolean;
}

export default function NotesEditor({
  content,
  onUpdateNotes,
}: NotesEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
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

  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
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
          applyFormatting(event, () =>
            editor.chain().focus().toggleUnderline().run(),
          )
        }
        disabled={!editor.can().toggleUnderline()}
        className={`${buttonBaseClasses} ${
          editor.isActive("underline") ? activeClasses : inactiveClasses
        }`}
      >
        Underline
      </button>
      <button
        onMouseDown={(event) =>
          applyFormatting(event, () =>
            editor.chain().focus().toggleStrike().run(),
          )
        }
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`${buttonBaseClasses} ${
          editor.isActive("strike") ? activeClasses : inactiveClasses
        }`}
      >
        Strike
      </button>
      {/* Input field for link URL */}
      <input
        type="text"
        placeholder="Enter URL"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        className="px-2 py-1 text-sm border rounded"
      />
      {/* Button to apply link */}
      <button
        onMouseDown={(event) => applyFormatting(event, toggleLink)}
        disabled={!linkUrl}
        className="px-2 py-1 text-sm font-medium rounded transition-colors duration-150 bg-blue-500 text-white hover:bg-blue-600"
      >
        Toggle Link
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
