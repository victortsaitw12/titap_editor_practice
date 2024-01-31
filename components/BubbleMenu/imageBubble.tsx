// ImageFigureMenu.tsx
import React, { useEffect } from "react";
import { GalleryVertical, Tv2, Trash2 } from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import ImageCaptionDialog from "../ImageCaptionDialog";
import { deleteNode } from "../custom-extension/extension-figure/utils/function";

interface ImageFigureMenuProps {
  editor: Editor;
  imageFigureOpen: boolean;
  setImageFigureOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFigureActive: boolean;
}

const ImageFigureMenu = ({
  editor,
  imageFigureOpen,
  setImageFigureOpen,
  isFigureActive,
}: ImageFigureMenuProps) => {
  return (
    <>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={true}
        onPressedChange={() => {
          editor.chain().focus().setFigureClass({ customClass: "" }).run();
        }}
      >
        <GalleryVertical></GalleryVertical>
      </Toggle>
      <Toggle
        className={`bubble-menu-item`}
        size="sm"
        pressed={true}
        onPressedChange={() => {
          editor
            .chain()
            .focus()
            .setFigureClass({ customClass: "fullImage" })
            .run();
        }}
      >
        <Tv2></Tv2>
      </Toggle>
      <ImageCaptionDialog
        editor={editor}
        imageFigureOpen={imageFigureOpen}
        setImageFigureOpen={setImageFigureOpen}
      ></ImageCaptionDialog>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={true}
        onPressedChange={() => {
          isFigureActive
            ? deleteNode(editor, "figure")
            : deleteNode(editor, "image");
        }}
      >
        <Trash2></Trash2>
      </Toggle>
    </>
  );
};

export default ImageFigureMenu;
