import React from "react";
import {
  Bold,
  Strikethrough,
  Italic,
  Underline,
  Code,
  Superscript,
  Subscript,
  Link,
} from "lucide-react";
import { Toggle } from "../ui/toggle";
import { Editor } from "@tiptap/react";
type TextBubbleMenuProps = {
  editor: Editor;
  setLinkValue: React.Dispatch<React.SetStateAction<string>>;
  setLinkIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const TextBubbleMenu = ({
  editor,
  setLinkValue,
  setLinkIsOpen,
}: TextBubbleMenuProps) => {
  return (
    <>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={editor.isActive("code")}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Toggle>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={editor.isActive("superscript")}
        onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <Superscript className="h-4 w-4" />
      </Toggle>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={editor.isActive("subscript")}
        onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
      >
        <Subscript className="h-4 w-4" />
      </Toggle>
      <button
        className="left-separator"
        onClick={(e) => {
          setLinkValue("");
          setLinkIsOpen(true);
          e.stopPropagation();
        }}
      >
        <Link className="h-4 w-4" />
      </button>
    </>
  );
};

export default TextBubbleMenu;
