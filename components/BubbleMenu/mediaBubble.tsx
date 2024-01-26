// MediaMenu.tsx
import React from "react";
import { Trash2 } from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";

type MediaMenuProps = {
  editor: Editor | null;
};

const MediaMenu = ({ editor }: MediaMenuProps) => {
  return (
    <>
      {/* Youtube,Instagram,Twitter,Facebook menu */}
      <Toggle
        className="bubble-menu-item"
        size="sm"
        onPressedChange={() => editor?.chain().focus().deleteSelection().run()}
      >
        <Trash2></Trash2>
      </Toggle>
    </>
  );
};

export default MediaMenu;
