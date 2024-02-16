// ImageFigureMenu.tsx
import React, { useContext, useEffect } from "react";
import { GalleryVertical, Tv2, Trash2 } from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import ImageCaptionDialog from "../ImageCaptionDialog";
import {
  changeNodeClass,
  deleteNode,
} from "../custom-extension/extension-figure/utils/function";
import EditorContentContext, {
  EditorContentProps,
} from "@/context/editorContext";

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
  const { editorImages, setEditorImages } = useContext<
    EditorContentProps | any
  >(EditorContentContext);
  const handleRemoveImage = () => {
    const attrs = isFigureActive
      ? editor?.getAttributes("figure")
      : editor?.getAttributes("image");
    let attrsIndex = 0;
    editorImages.map((item: any, index: any) => {
      if (item.name === attrs.name) {
        attrsIndex = index;
        return;
      }
    });
    if (attrsIndex) {
      setEditorImages((prev: any) => {
        const tmpImages = [...prev];
        tmpImages.splice(attrsIndex, 1);
        return tmpImages;
      });
    }
    isFigureActive ? deleteNode(editor, "figure") : deleteNode(editor, "image");
  };

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
        onPressedChange={handleRemoveImage}
      >
        <Trash2></Trash2>
      </Toggle>
    </>
  );
};

export default ImageFigureMenu;
