"use client";
import React, { useState, useEffect, useContext } from "react";
import { type Editor, BubbleMenu } from "@tiptap/react";
import LinkContext, { LinkProps } from "@/context/linkContext";
import LinkMenu from "./BubbleMenu/linkBubble";
import MediaMenu from "./BubbleMenu/mediaBubble";
import TextBubbleMenu from "./BubbleMenu/textBubble";
import ImageFigureMenu from "./BubbleMenu/imageBubble";

type Props = {
  editor: Editor | null;
  isImageActive: boolean;
  isYoutubeActive: boolean;
  isInstagramActive: boolean;
  isTwitterActive: boolean;
  isLinkActive: boolean;
  isFacebookActive: boolean;
  isFigureActive: boolean;
};
function BubbleMenuList({
  editor,
  isImageActive,
  isYoutubeActive,
  isInstagramActive,
  isTwitterActive,
  isLinkActive,
  isFacebookActive,
  isFigureActive,
}: Props) {
  const [linkValue, setLinkValue] = useState("");
  const [imageFigureOpen, setImageFigureOpen] = useState<boolean>(false);
  const { linkIsOpen, setLinkIsOpen, linkModify, setLinkModify } = useContext<
    LinkProps | any
  >(LinkContext);

  useEffect(() => {
    isLinkActive && !linkIsOpen ? setLinkModify(true) : setLinkModify(false);
  }, [isLinkActive, linkIsOpen, setLinkModify]);

  const mediaIsActive =
    isYoutubeActive || isInstagramActive || isTwitterActive || isFacebookActive;

  const imageFigure = isImageActive || isFigureActive;

  const textBubbleMenu =
    !mediaIsActive &&
    !imageFigure &&
    !linkIsOpen &&
    !linkModify &&
    !isLinkActive;
  if (!editor) {
    return null;
  }

  return (
    <>
      <BubbleMenu
        className={` ${
          linkIsOpen || linkModify || isLinkActive ? "" : "bubble-menu"
        } ${imageFigure && imageFigureOpen ? "opacity-0" : ""} ${
          isFigureActive ? "" : ""
        }`}
        tippyOptions={{ duration: 100 }}
        editor={editor}
      >
        {/* 文字 menu */}
        {textBubbleMenu && (
          <TextBubbleMenu
            editor={editor}
            setLinkValue={setLinkValue}
            setLinkIsOpen={setLinkIsOpen}
          />
        )}

        {/* 圖片 menu */}
        {imageFigure && (
          <ImageFigureMenu
            editor={editor}
            imageFigureOpen={imageFigureOpen}
            setImageFigureOpen={setImageFigureOpen}
            isFigureActive={isFigureActive}
          />
        )}

        {/* Youtube,Instagram,Twitter,Facebook menu */}
        {mediaIsActive && <MediaMenu editor={editor} />}

        {/* 輸入網址 area */}
        <LinkMenu
          editor={editor}
          setLinkModify={setLinkModify}
          linkValue={linkValue}
          setLinkValue={setLinkValue}
          isLinkActive={isLinkActive}
          linkModify={linkModify}
        />
      </BubbleMenu>
    </>
  );
}

export default BubbleMenuList;
