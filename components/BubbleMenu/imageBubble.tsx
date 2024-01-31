// ImageFigureMenu.tsx
import React, { useEffect } from "react";
import { GalleryVertical, Tv2, Trash2 } from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import ImageCaptionDialog from "../ImageCaptionDialog";
import {
  changeNodeClass,
  deleteNode,
} from "../custom-extension/extension-figure/utils/function";

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
          changeNodeClass(
            editor,
            isFigureActive ? "figure" : "image",
            "normal"
          );
        }}
      >
        <GalleryVertical></GalleryVertical>
      </Toggle>
      <Toggle
        className={`bubble-menu-item`}
        size="sm"
        pressed={true}
        onPressedChange={() => {
          console.log(`isFigureActive:${isFigureActive}`);
          changeNodeClass(
            editor,
            isFigureActive ? "figure" : "image",
            "fullScreen"
          );
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
