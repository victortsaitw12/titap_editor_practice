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
import CustomTooltip from "../tooltipContent";
type TextBubbleMenuProps = {
  editor: Editor;
  setLinkValue: React.Dispatch<React.SetStateAction<string>>;
  setLinkIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  delayDuration: number;
};
const TextBubbleMenu = ({
  editor,
  setLinkValue,
  setLinkIsOpen,
  delayDuration,
}: TextBubbleMenuProps) => {
  return (
    <>
      <CustomTooltip delayDuration={delayDuration} content="粗體">
        <Toggle
          className="bubble-menu-item"
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="斜體">
        <Toggle
          className="bubble-menu-item"
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="刪除線">
        <Toggle
          className="bubble-menu-item"
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="底線">
        <Toggle
          className="bubble-menu-item"
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="程式碼">
        <Toggle
          className="bubble-menu-item"
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Toggle>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="上標">
        <Toggle
          className="bubble-menu-item"
          size="sm"
          pressed={editor.isActive("superscript")}
          onPressedChange={() =>
            editor.chain().focus().toggleSuperscript().run()
          }
        >
          <Superscript className="h-4 w-4" />
        </Toggle>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="下標">
        <Toggle
          className="bubble-menu-item"
          size="sm"
          pressed={editor.isActive("subscript")}
          onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
        >
          <Subscript className="h-4 w-4" />
        </Toggle>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="建立連結">
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
      </CustomTooltip>
    </>
  );
};

export default TextBubbleMenu;
