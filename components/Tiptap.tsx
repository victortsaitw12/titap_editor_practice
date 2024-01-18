"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import BubbleMenuList from "./BubbleMenuList";
// import FloatingMenuList from "./FloatingMenuList"
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import GripVertical from "lucide-react";
import { mergeAttributes } from "@tiptap/core";
import Youtube from "@tiptap/extension-youtube";
import Instagram from "./custom-extension/extension-instagram";
import Twitter from "./custom-extension/extension-twitter";
import CustomLink from "./custom-extension/extension-link";
import { useContext } from "react";
import LinkContext, { LinkProps } from "@/context/linkContext";

function Tiptap({
  description,
  onChange,
}: {
  description: string;
  onChange: (richText: string) => void;
}) {
  const { linkModify, setLinkModify } = useContext<LinkProps | any>(
    LinkContext
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      // CustomParagraph.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline.configure(),
      Superscript.configure(),
      Subscript.configure(),
      CustomLink.configure({
        protocols: [
          {
            scheme: "tel",
            optionalSlashes: true,
          },
        ],
        openOnClick: true,
        autolink: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "custom-hr",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "order-list",
        },
      }),
      Youtube.configure(),
      Instagram.configure(),
      Twitter.configure(),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none rounded-md border-none min-h-[150px] bg-background disabled:curdor-not-allowed disabled:opacity-50",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  const isImageActive = editor ? editor.isActive("image") : false;
  const isYoutubeActive = editor ? editor.isActive("youtube") : false;
  const isInstagramActive = editor ? editor.isActive("instagram") : false;
  const isTwitterActive = editor ? editor.isActive("twitter") : false;
  return (
    <div>
      <div className="toolbar mx-auto">
        <Toolbar editor={editor} />
      </div>
      <div className="container">
        <div className="title-wrap">
          <input className="title" type="text" defaultValue={"Title"} />
        </div>
        {/* <FloatingMenuList editor={editor}/> */}
        <BubbleMenuList
          editor={editor}
          isImageActive={isImageActive}
          isYoutubeActive={isYoutubeActive}
          isInstagramActive={isInstagramActive}
          isTwitterActive={isTwitterActive}
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default Tiptap;
