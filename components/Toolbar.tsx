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
  Plus,
  SeparatorHorizontal,
} from "lucide-react";
import { Toggle } from "./ui/toggle";
import ImageUploadDialog from "./ImageUploadDialog";
import ImageSearchDialog from "./ImageSearchDialog";
import MediaContentContext, {
  MediaContentProps,
} from "../context/mediaContentContext";
import MediaLinkDialog from "./MediaLinkDialog";
import CustomTooltip from "./tooltipContent";

type Props = {
  editor: Editor | null;
};
function Toolbar({ editor }: Props) {
  const [align, setAlign] = useState("left");
  const { isOpen, setIsOpen } = useContext<MediaContentProps | any>(
    MediaContentContext
  );
  // tooltip delayDuration
  const delayDuration = 0;

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
        <CustomTooltip delayDuration={delayDuration} content="多媒體">
          <button>
            <Plus size={20}></Plus>
          </button>
        </CustomTooltip>

        {isOpen && (
          <div className="mediaContent">
            <CustomTooltip
              delayDuration={delayDuration}
              content="上傳圖片"
              side="bottom"
            >
              <ImageUploadDialog editor={editor} />
            </CustomTooltip>

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
            <CustomTooltip
              delayDuration={delayDuration}
              content="圖庫"
              side="bottom"
            >
              <ImageSearchDialog editor={editor}></ImageSearchDialog>
            </CustomTooltip>
            <CustomTooltip
              delayDuration={delayDuration}
              content=" 嵌入網站"
              side="bottom"
            >
              <MediaLinkDialog editor={editor}></MediaLinkDialog>
            </CustomTooltip>
            <CustomTooltip
              delayDuration={delayDuration}
              content="分隔線"
              side="bottom"
            >
              <Toggle
                className="bubble-menu-item"
                size="sm"
                pressed={editor.isActive("separatorHorizontal")}
                onPressedChange={handleDividerClick}
              >
                <SeparatorHorizontal className="h-4 w-4" />
              </Toggle>
            </CustomTooltip>
          </div>
        )}
      </div>
      <CustomTooltip delayDuration={delayDuration} content="大標題">
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
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="中標題">
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
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="引言">
        <Toggle
          className="menu-item"
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="程式碼">
        <Toggle
          className="menu-item"
          size="sm"
          pressed={editor.isActive("codeBlock")}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="h-4 w-4" />
        </Toggle>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="變更對齊">
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
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="項目符號">
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
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="數字項目符號">
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
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="復原">
        <button
          className={`w-[25px] h-[36px] flex items-center justify-center left-seprator  enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30`}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className={`h-4 w-4 `} />
        </button>
      </CustomTooltip>
      <CustomTooltip delayDuration={delayDuration} content="取消復原">
        <button
          className={`w-[25px] h-[36px] flex items-center justify-center  enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30`}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </button>
      </CustomTooltip>
    </>
  );
}

export default Toolbar;
