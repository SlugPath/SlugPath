import BulletList from "@tiptap/extension-bullet-list";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [
  StarterKit,
  Underline,
  Superscript,
  Subscript,
  ListItem,
  BulletList,
  OrderedList,
  TextStyle,
  Color,
];

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
    "px-2 py-1 text-sm font-medium rounded transition-colors duration-150 mr-1";
  const colorButtonClass =
    "text-sm font-medium rounded transition-colors duration-150 mr-1";
  const activeClasses = "bg-blue-500 text-white hover:bg-blue-600";
  const inactiveClasses = "bg-gray-200 text-gray-800 hover:bg-gray-300";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <div className="border-1 border-red-50 h-full">
      {/* Bold Button */}
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
      {/* Italic Button */}
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
      {/* Underline Button */}
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
      {/* Subscript Button */}
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
      {/* Color Picker */}
      <input
        type="color"
        onMouseDown={(event) => event.preventDefault()}
        onChange={(event) =>
          editor.chain().focus().setColor(event.target.value).run()
        }
        value={editor.getAttributes("textStyle").color || "#000000"}
        className={`${colorButtonClass} cursor-pointer`}
      />
      {/* Superscript Button */}
      <button
        onMouseDown={(event) =>
          applyFormatting(event, () =>
            editor.chain().focus().toggleSuperscript().run(),
          )
        }
        disabled={!editor.can().toggleSuperscript()}
        className={`${buttonBaseClasses} ${
          editor.isActive("superscript") ? activeClasses : inactiveClasses
        }`}
      >
        Superscript
      </button>
      {/* Subscript Button */}
      <button
        onMouseDown={(event) =>
          applyFormatting(event, () =>
            editor.chain().focus().toggleSubscript().run(),
          )
        }
        disabled={!editor.can().toggleSubscript()}
        className={`${buttonBaseClasses} ${
          editor.isActive("subscript") ? activeClasses : inactiveClasses
        }`}
      >
        Subscript
      </button>
      {/* Unordered List Button */}
      <button
        onMouseDown={(event) =>
          applyFormatting(event, () =>
            editor.chain().focus().toggleBulletList().run(),
          )
        }
        className={`${buttonBaseClasses} ${
          editor.isActive("bulletList") ? activeClasses : inactiveClasses
        }`}
      >
        Bullet List
      </button>
      {/* Ordered List Button */}
      <button
        onMouseDown={(event) =>
          applyFormatting(event, () =>
            editor.chain().focus().toggleOrderedList().run(),
          )
        }
        className={`${buttonBaseClasses} ${
          editor.isActive("orderedList") ? activeClasses : inactiveClasses
        }`}
      >
        Numbered List
      </button>
      {/* Undo Button */}
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
      {/* Redo Button */}
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
