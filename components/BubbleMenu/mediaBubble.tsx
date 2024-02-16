// MediaMenu.tsx
import React from "react";
import { Trash2 } from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import CustomTooltip from "../tooltipContent";

type MediaMenuProps = {
  editor: Editor | null;
  delayDuration: number;
};

const MediaMenu = ({ editor, delayDuration }: MediaMenuProps) => {
  return (
    <>
      {/* Youtube,Instagram,Twitter,Facebook menu */}
      <CustomTooltip delayDuration={delayDuration} content="移除">
        <Toggle
          className="bubble-menu-item"
          size="sm"
          onPressedChange={() =>
            editor?.chain().focus().deleteSelection().run()
          }
        >
          <Trash2></Trash2>
        </Toggle>
      </CustomTooltip>
    </>
  );
};

export default MediaMenu;
