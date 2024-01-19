"use client";
import React, { useCallback, useState, useEffect, useContext } from "react";
import { type Editor, BubbleMenu } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  Underline,
  Code,
  Superscript,
  Subscript,
  Link,
  Trash2,
  GalleryVertical,
  Fullscreen,
  Pencil,
  Tv2,
  X,
  Unlink,
} from "lucide-react";
import { Toggle } from "./ui/toggle";
import LinkContext, { LinkProps } from "@/context/linkContext";

type Props = {
  editor: Editor | null;
  isImageActive: boolean;
  isYoutubeActive: boolean;
  isInstagramActive: boolean;
  isTwitterActive: boolean;
  isLinkActive: boolean;
};
function BubbleMenuList({
  editor,
  isImageActive,
  isYoutubeActive,
  isInstagramActive,
  isTwitterActive,
  isLinkActive,
}: Props) {
  const [linkValue, setLinkValue] = useState("");
  const { linkIsOpen, setLinkIsOpen, linkModify, setLinkModify } = useContext<
    LinkProps | any
  >(LinkContext);
  useEffect(() => {
    isLinkActive && !linkIsOpen ? setLinkModify(true) : setLinkModify(false);
  }, [isLinkActive, linkIsOpen, setLinkModify]);
  if (!editor) {
    return null;
  }
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && editor) {
      const url = e.target.value;
      const oldHref = editor.getAttributes("link").href;
      if (oldHref) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .toggleLink({ href: url })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }
      setLinkIsOpen(false);
      setLinkModify(true);
      e.stopPropagation();
    }
  };
  const mediaIsActive = isYoutubeActive || isInstagramActive || isTwitterActive;
  const textBubbleMenu =
    !mediaIsActive &&
    !isImageActive &&
    !linkIsOpen &&
    !linkModify &&
    !isLinkActive;
  const linkInput = linkIsOpen && !linkModify;
  const linkEdit = isLinkActive && linkModify;

  return (
    <>
      <BubbleMenu
        className={` ${
          linkIsOpen || linkModify || isLinkActive ? "" : "bubble-menu"
        }`}
        tippyOptions={{ duration: 100 }}
        editor={editor}
      >
        {/* 文字 menu */}
        {textBubbleMenu && (
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
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              className="bubble-menu-item"
              size="sm"
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Toggle
              className="bubble-menu-item"
              size="sm"
              pressed={editor.isActive("underline")}
              onPressedChange={() =>
                editor.chain().focus().toggleUnderline().run()
              }
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
              onPressedChange={() =>
                editor.chain().focus().toggleSuperscript().run()
              }
            >
              <Superscript className="h-4 w-4" />
            </Toggle>
            <Toggle
              className="bubble-menu-item"
              size="sm"
              pressed={editor.isActive("subscript")}
              onPressedChange={() =>
                editor.chain().focus().toggleSubscript().run()
              }
            >
              <Subscript className="h-4 w-4" />
            </Toggle>
            <button
              className="left-seprator"
              onClick={(e) => {
                setLinkValue("");
                setLinkIsOpen(true);
                e.stopPropagation();
              }}
            >
              <Link className="h-4 w-4" />
            </button>
          </>
        )}
        {/* 圖片 menu */}
        {isImageActive && (
          <>
            <Toggle
              className="bubble-menu-item"
              size="sm"
              pressed={editor.isActive("image")}
              onPressedChange={() => {
                console.log("normalImage button");
              }}
            >
              <GalleryVertical></GalleryVertical>
            </Toggle>
            <Toggle
              className={`bubble-menu-item`}
              size="sm"
              pressed={editor.isActive("image")}
              onPressedChange={() => {
                console.log("fullImage button");
              }}
            >
              <Tv2></Tv2>
            </Toggle>
            <Toggle
              className="bubble-menu-item left-seprator"
              size="sm"
              pressed={editor.isActive("image")}
              onPressedChange={() => console.log("image is active1")}
            >
              <Pencil></Pencil>
            </Toggle>
            <Toggle
              className="bubble-menu-item"
              size="sm"
              pressed={editor.isActive("image")}
              onPressedChange={() =>
                editor.chain().focus().setImage({ src: "" }).run()
              }
            >
              <Trash2></Trash2>
            </Toggle>
          </>
          // 顯示圖片相關的選項
        )}
        {/* Youtube,Instagram,Twitter menu */}
        {mediaIsActive && (
          <Toggle
            className="bubble-menu-item"
            size="sm"
            pressed={editor.isActive("youtube")}
            onPressedChange={() =>
              editor.chain().focus().deleteSelection().run()
            }
          >
            <Trash2></Trash2>
          </Toggle>
        )}
        {/* 輸入網址 area */}
        {linkInput && (
          <div
            className=" bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center"
            onClick={(e) => {
              setLinkIsOpen(true);
              e.stopPropagation();
            }}
          >
            <input
              className="outline-none w-[220px]"
              placeholder="請輸入網址，按Enter完成"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            <button
              onClick={(e) => {
                setLinkIsOpen(false);
                e.stopPropagation();
              }}
            >
              <X size={20} color={"#bbb"}></X>
            </button>
            <button
              onClick={() => {
                setLinkValue("");
              }}
              className={`${linkValue.length > 0 ? "" : "cursor-not-allowed"}`}
              disabled={linkValue.length > 0 ? false : true}
            >
              <div className="ms-1 text-white bg-neutral-600 rounded-md px-2 py-1 w-[50px] text-center text-sm">
                清除
              </div>
            </button>
          </div>
        )}
        {/* 進入或解除或編輯網址 area */}
        {linkEdit && (
          <div className="text-sky-300 bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-between">
            <a
              href={`${editor.getAttributes("link").href}`}
              className="w-[200px]"
              target="_blank"
            >
              {editor.getAttributes("link").href}
            </a>
            <div className="flex">
              <Pencil
                size={20}
                color={"#bbb"}
                className="me-2 cursor-pointer"
                onClick={(e) => {
                  console.log("bubbleMenu linkModify1");

                  setLinkModify(false);
                  setLinkIsOpen(true);
                  e.stopPropagation();
                }}
              ></Pencil>
              <Unlink
                size={20}
                color={"#bbb"}
                className="cursor-pointer"
                onClick={() => {
                  // console.log(editor && editor.getAttributes("link").href);
                  console.log("bubbleMenu linkModify2");

                  editor &&
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .unsetLink()
                      .run();
                  setLinkValue("");
                  setLinkModify(false);
                }}
              ></Unlink>
            </div>
          </div>
        )}
      </BubbleMenu>
    </>
  );
}

export default BubbleMenuList;
