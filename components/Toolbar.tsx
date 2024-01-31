"use client";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { type Editor } from "@tiptap/react";
import {
  List,
  ListOrdered,
  Heading2,
  Heading3,
  AlignCenter,
  Quote,
  Code2,
  Undo,
  Redo,
  Image,
  Plus,
  Link,
  GalleryHorizontal,
  FileSearch,
  SeparatorHorizontal,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";
import ImageUploadDialog from "./ImageUploadDialog";
import ImageSearchDialog from "./ImageSearchDialog";
import MediaContentContext, {
  MediaContentProps,
} from "../context/mediaContentContext";
import MediaLinkDialog from "./MediaLinkDialog";

type Props = {
  editor: Editor | null;
};
function Toolbar({ editor }: Props) {
  const [align, setAlign] = useState("left");
  const { isOpen, setIsOpen } = useContext<MediaContentProps | any>(
    MediaContentContext
  );

  const handleDividerClick = useCallback(() => {
    editor?.chain().focus().setHorizontalRule().run();

    // 模擬按下 Enter 鍵
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
    });
    document.dispatchEvent(event);
  }, [editor]);

  if (!editor) {
    return null;
  }
  const listClicked = editor.isActive("bulletList");
  const orderListClicked = editor.isActive("orderedList");

  const setTextAlign = () => {
    if (align == "left") {
      setAlign("center");
    } else if (align == "center") {
      setAlign("right");
    } else {
      setAlign("left");
    }
  };

  return (
    // <div className='border border-input bg-transparent rounded-sm'>
    <>
      <div
        className="ps-[10px] pt-[5px] pe-[6px] relative"
        onClick={(e) => {
          setIsOpen(true);
          e.stopPropagation();
        }}
      >
        <button>
          <Plus size={20}></Plus>
        </button>
        {isOpen && (
          <div className="mediaContent">
            <ImageUploadDialog editor={editor} />
            {/* <Toggle
              className="bubble-menu-item"
              size="sm"
              pressed={editor.isActive("galleryHorizontal")}
              onPressedChange={() => {
                console.log("輪播圖");
              }}
            >
              <GalleryHorizontal className="h-4 w-4" />
            </Toggle> */}
            <ImageSearchDialog editor={editor}></ImageSearchDialog>
            <MediaLinkDialog editor={editor}></MediaLinkDialog>
            <Toggle
              className="bubble-menu-item"
              size="sm"
              pressed={editor.isActive("separatorHorizontal")}
              onPressedChange={handleDividerClick}
            >
              <SeparatorHorizontal className="h-4 w-4" />
            </Toggle>
          </div>
        )}
      </div>

      <Toggle
        className="menu-item"
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        className="menu-item"
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>
      <Toggle
        className="menu-item"
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4 text-black" />
      </Toggle>
      <Toggle
        className="menu-item"
        size="sm"
        pressed={editor.isActive("codeBlock")}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 className="h-4 w-4 text-black" />
      </Toggle>
      <div
        className={`${
          listClicked || orderListClicked ? "cursor-not-allowed" : ""
        }`}
      >
        <Toggle
          disabled={listClicked || orderListClicked ? true : false}
          className="menu-item disabled:bg-neutral-400"
          size="sm"
          pressed={editor.isActive("textAlign")}
          onPressedChange={() => {
            setTextAlign();
            editor.chain().focus().setTextAlign(align).run();
          }}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
      </div>
      <div className={`${orderListClicked ? "cursor-not-allowed" : ""}`}>
        <Toggle
          disabled={orderListClicked ? true : false}
          className="menu-item disabled:bg-neutral-400"
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </Toggle>
      </div>

      <div className={`${listClicked ? "cursor-not-allowed" : ""}`}>
        <Toggle
          disabled={listClicked ? true : false}
          className="menu-item disabled:bg-neutral-400"
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
      </div>

      <button
        className="left-seprator"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </button>
    </>
  );
}

export default Toolbar;
