"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import { Button } from "../components/ui/button";

import BubbleMenuList from "./BubbleMenuList";
// import FloatingMenuList from "./FloatingMenuList"
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Youtube from "@tiptap/extension-youtube";
import Instagram from "./custom-extension/extension-instagram";
import Twitter from "./custom-extension/extension-twitter";
import CustomLink from "./custom-extension/extension-link";
import Facebook from "./custom-extension/extension-facebook";
import { useContext, useEffect, useState } from "react";
import Figure from "./custom-extension/extension-figure";
import EditorContentContext, {
  EditorContentProps,
} from "@/context/editorContext";
import CustomImage from "./custom-extension/extension-image";
import CustomParagraph from "./custom-extension/extension-paragraph";
import Small from "./custom-extension/extension-small";

function Tiptap({
  description,
  onChange,
}: {
  description: string;
  onChange: (richText: string) => void;
}) {
  const { data, setData } = useContext<EditorContentProps | any>(
    EditorContentContext
  );
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
        paragraph: false,
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
      CustomImage.configure(),
      Youtube.configure(),
      Instagram.configure(),
      Twitter.configure(),
      Facebook.configure(),
      Figure.configure(),
      CustomParagraph.configure(),
      Small.configure(),
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
      setData(JSON.stringify(editor.getJSON()));

      console.log(editor.getHTML());
      // console.log(JSON.stringify(editor.getJSON()));
      // console.log(JSON.parse(JSON.stringify(editor.getJSON())));
    },
  });

  const isImageActive = editor ? editor.isActive("image") : false;
  const isFigureActive = editor ? editor.isActive("figure") : false;
  const isYoutubeActive = editor ? editor.isActive("youtube") : false;
  const isInstagramActive = editor ? editor.isActive("instagram") : false;
  const isLinkActive = editor ? editor.isActive("link") : false;
  const isTwitterActive = editor ? editor.isActive("twitter") : false;
  const isFacebookActive = editor ? editor.isActive("facebook") : false;
  const [updateDt, setUpdateDt] = useState("");
  let timer: any;

  const updateContent = () => {
    timer = setInterval(() => {
      let now = new Date();
      let hour = now.getHours();
      let min = now.getMinutes();
      setUpdateDt(hour + ":" + min);
    }, 1000);
  };

  useEffect(() => {
    updateContent();
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="w-full fixed top-0 left-0 bg-white z-50">
        <div className="head">
          <div>{updateDt} 已自動儲存</div>
          <Button
            onClick={() => {
              console.log(data);
            }}
          >
            準備發佈
          </Button>
        </div>
        <div className="toolbar mx-auto">
          <Toolbar editor={editor} />
        </div>
      </div>
      <div className="container relative z-10">
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
    </>
  );
}

export default Tiptap;
