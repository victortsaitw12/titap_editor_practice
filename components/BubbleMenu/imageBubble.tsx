// ImageFigureMenu.tsx
import React from "react";
import { GalleryVertical, Tv2, Trash2 } from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import ImageCaptionDialog from "../ImageCaptionDialog";

interface ImageFigureMenuProps {
  editor: Editor;
  imageFigureOpen: boolean;
  setImageFigureOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageFigureMenu: React.FC<ImageFigureMenuProps> = ({
  editor,
  imageFigureOpen,
  setImageFigureOpen,
}) => {
  return (
    <>
      <Toggle
        className="bubble-menu-item"
        size="sm"
        pressed={true} // 設定 GalleryVertical 的條件
        onPressedChange={() => {
          editor.chain().focus().setFigureClass({ customClass: "" }).run();
        }}
      >
        <GalleryVertical></GalleryVertical>
      </Toggle>
      <Toggle
        className={`bubble-menu-item`}
        size="sm"
        pressed={true} // 設定 Tv2 的條件
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
        pressed={true} // 設定 Trash2 的條件
        onPressedChange={() => {
          console.log("點擊這裡刪除圖片");
          editor.chain().focus().lift("figure").deleteSelection().run();
        }}
      >
        <Trash2></Trash2>
      </Toggle>
    </>
  );
};

export default ImageFigureMenu;
