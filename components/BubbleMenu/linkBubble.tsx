// LinkMenu.jsx
import React, { useState, useContext, useEffect } from "react";
import { X, Pencil, Unlink } from "lucide-react";
import LinkContext, { LinkProps } from "@/context/linkContext";
import { Editor } from "@tiptap/react";
import CustomTooltip from "../tooltipContent";

type Props = {
  editor: Editor | null;
  isLinkActive: boolean;
  linkModify: boolean;
  setLinkModify: React.Dispatch<React.SetStateAction<boolean>>;
  linkValue: string;
  setLinkValue: React.Dispatch<React.SetStateAction<string>>;
  delayDuration: number;
};
const LinkMenu = ({
  editor,
  isLinkActive,
  linkModify,
  setLinkModify,
  linkValue,
  setLinkValue,
  delayDuration,
}: Props) => {
  const { linkIsOpen, setLinkIsOpen } = useContext<LinkProps | any>(
    LinkContext
  );

  const linkInput = linkIsOpen && !linkModify;
  const linkEdit = isLinkActive && linkModify;
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

  return (
    <>
      {/* 輸入網址區域 */}
      {linkInput && (
        <div
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center"
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
      {/* 進入、解除或編輯網址區域 */}
      {linkEdit && (
        <div className="text-sky-300 bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-between">
          <a
            href={`${editor?.getAttributes("link").href}`}
            className="w-[200px]"
            target="_blank"
          >
            {editor?.getAttributes("link").href}
          </a>
          <div className="flex">
            <CustomTooltip delayDuration={delayDuration} content="編輯">
              <Pencil
                size={20}
                color={"#bbb"}
                className="me-2 cursor-pointer"
                onClick={(e) => {
                  setLinkModify(false);
                  setLinkIsOpen(true);
                  e.stopPropagation();
                }}
              ></Pencil>
            </CustomTooltip>
            <CustomTooltip delayDuration={delayDuration} content="解除連結">
              <Unlink
                size={20}
                color={"#bbb"}
                className="cursor-pointer"
                onClick={() => {
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
            </CustomTooltip>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkMenu;
