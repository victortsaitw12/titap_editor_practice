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
import Youtube from "@tiptap/extension-youtube";
import Instagram from "./custom-extension/extension-instagram";
import Twitter from "./custom-extension/extension-twitter";
import CustomLink from "./custom-extension/extension-link";
import Facebook from "./custom-extension/extension-facebook";
import { useEffect } from "react";
import Figure from "./custom-extension/extension-figure";
function Tiptap({
  description,
  onChange,
}: {
  description: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: {
          HTMLAttributes: {
            class: "custom-hr",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "order-list",
          },
        },
      }),
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
        openOnClick: false,
        autolink: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Youtube.configure(),
      Instagram.configure(),
      Twitter.configure(),
      Facebook.configure(),
      Figure.configure(),
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
    // onTransaction: ({ editor }) => {
    //   // const cursorLine = editor.view.state.selection.$anchor.path[1]
    //   console.log("cursorLine:", editor.view.state.selection.$anchor);
    // },
  });

  const isImageActive = editor ? editor.isActive("image") : false;
  const isFigureActive = editor ? editor.isActive("figure") : false;
  const isYoutubeActive = editor ? editor.isActive("youtube") : false;
  const isInstagramActive = editor ? editor.isActive("instagram") : false;
  const isLinkActive = editor ? editor.isActive("link") : false;
  const isTwitterActive = editor ? editor.isActive("twitter") : false;
  const isFacebookActive = editor ? editor.isActive("facebook") : false;
  useEffect(() => {
    console.log(`tiptap:${isFigureActive}`);
  }, [isFigureActive]);
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
          isLinkActive={isLinkActive}
          isFacebookActive={isFacebookActive}
          isFigureActive={isFigureActive}
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default Tiptap;
