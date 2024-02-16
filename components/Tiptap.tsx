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
import EventExtension from "./custom-extension/extension-event";
import CustomYoutube from "./custom-extension/extension-youtube";
import MediaContentContext, {
  MediaContentProps,
} from "@/context/mediaContentContext";

function Tiptap({
  description,
  onChange,
}: {
  description: string;
  onChange: (richText: string) => void;
}) {
  const { setEditorTitle, setData, editorImages, setEditorImages } = useContext<
    EditorContentProps | any
  >(EditorContentContext);
  const [title, setTitle] = useState("");
  const { setIsDisabled } = useContext<MediaContentProps | any>(
    MediaContentContext
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
      CustomYoutube.configure(),
      Instagram.configure(),
      Twitter.configure(),
      Facebook.configure(),
      Figure.configure(),
      CustomParagraph.configure(),
      Small.configure(),
      EventExtension.configure(),
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
      // setData(JSON.stringify(editor.getJSON()));
      // setData(editor.getHTML());

      // console.log(JSON.stringify(editor.getJSON()));
      // console.log(JSON.parse(JSON.stringify(editor.getJSON())));
    },
    // 先foucs在編輯器再判斷該行是否為空字串
    onFocus({ editor, event }) {
      editor.on("transaction", ({ transaction }) => {
        setIsDisabled(
          transaction.selection.$anchor.parentOffset === 0 ? false : true
        );
      });
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
  const compressOverSizeImage = () => {
    editorImages.map(
      (
        item: {
          file: string;
          name: string;
          alt?: string;
          size: number;
          blob: Blob;
        },
        index: number
      ) => {
        const fileSize = item.size / 1024; //KB
        const maxSize = 200;
        if (fileSize > maxSize) {
          // FileReader
          // new Promise<string>((resolve, reject) => {
          //   if (fileSize > maxSize) {
          //     const scale = (fileSize - maxSize) / fileSize;
          //     const factor = 0.18;
          //     const img = document.createElement("img");
          //     console.log(typeof item.file);
          //     img.src = item.file as string;
          //     img.onload = async () => {
          //       compressedDataURL = await compressImage(img, scale, factor);
          //       resolve(compressedDataURL);
          //     };
          //   }
          // }).then((compressedDataURL) => {
          //   console.log(`test:${(item.file as string) === compressedDataURL}`);
          //   editorImages[index].file = compressedDataURL;
          // });

          // Blob
          const scale = (fileSize - maxSize) / fileSize;
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
          const factor = 0.18;
          const img = document.createElement("img");
          const imgType = item.name.split(".")[1];
          img.src = item.file as string;
          img.onload = async () => {
            const cvWidth = img.width * (1 - scale + factor);
            const cvHeight = img.height * (1 - scale + factor);
            canvas.width = cvWidth;
            canvas.height = cvHeight;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(function (blob) {
              const newEditorImages = [...editorImages];
              const newBlobUrl = blob && URL.createObjectURL(blob);
              const imageName = newBlobUrl?.slice(-36) + "." + imgType;
              newEditorImages[index].file = newBlobUrl;
              newEditorImages[index].name = imageName;
              newEditorImages[index].size = blob?.size;
              newEditorImages[index].blob = blob;
              setEditorImages(newEditorImages);
            }, "image/jpeg" || "image/png");
          };
        }
      }
    );
  };

  const prepareToPost = () => {
    if (title) {
      setEditorTitle(title);
      compressOverSizeImage();
      setData(editor?.getHTML());
    } else {
      alert("請輸入標題");
    }
  };
  return (
    <>
      <div className="w-full fixed top-0 left-0 bg-white z-50">
        <div className="head">
          {/* <div>{updateDt} 已自動儲存</div> */}
          <Button onClick={prepareToPost}>準備發佈</Button>
        </div>
        <div className="toolbar mx-auto">
          <Toolbar editor={editor} />
        </div>
      </div>
      <div className="container relative z-10">
        <div className="title-wrap">
          <input
            className="title"
            type="text"
            // defaultValue={"Title"}
            value={title}
            placeholder="請輸入標題"
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            onFocus={() => {
              setIsDisabled(true);
            }}
          />
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
