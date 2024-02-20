// ImageUploadDialog.tsx
import React, { useState, Dispatch, SetStateAction, useContext } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { Pencil, Link } from "lucide-react";
import { type Editor } from "@tiptap/react";
import { setNode } from "./custom-extension/extension-figure/utils/function";
import EditorContentContext, {
  EditorContentProps,
} from "@/context/editorContext";
import CustomTooltip from "./tooltipContent";

type ImageCaptionDialogProps = {
  editor: Editor | null;
  imageFigureOpen: boolean;
  setImageFigureOpen: Dispatch<SetStateAction<boolean>>;
  delayDuration: number;
};

const ImageCaptionDialog = ({
  editor,
  imageFigureOpen,
  setImageFigureOpen,
  delayDuration,
}: ImageCaptionDialogProps) => {
  const [imageCaption, setImageCaption] = useState("");
  const [imageLink, setImageLink] = useState("");
  const { editorImages, setEditorImages } = useContext<
    EditorContentProps | any
  >(EditorContentContext);

  const handleSetImageCaption = () => {
    const imageSrc = editor?.isActive("figure")
      ? editor?.getAttributes("figure").src
      : editor?.isActive("image")
      ? editor?.getAttributes("image").src
      : "";
    const imageName = editor?.isActive("figure")
      ? editor?.getAttributes("figure").fileName
      : editor?.isActive("image")
      ? editor?.getAttributes("image").fileName
      : "";
    editor?.chain().lift("figure").deleteSelection().run();
    if (imageCaption) {
      setNode(
        editor,
        "figure",
        imageSrc,
        imageName,
        imageCaption,
        imageLink,
        true
      );
    } else {
      setNode(editor, "image", imageSrc, imageName);
    }
    const updateEditorImages = [...editorImages];
    let updateIdx = 0;
    updateEditorImages.map((item, index) => {
      if ((item.file as String) === imageSrc) {
        updateIdx = index;
        return;
      }
    });
    updateEditorImages[updateIdx] = {
      ...updateEditorImages[updateIdx],
      alt: imageCaption,
    };
    setEditorImages(updateEditorImages);
    setImageFigureOpen(false);
  };
  const linkDisabled = imageCaption.length === 0;

  return (
    <AlertDialog>
      <CustomTooltip delayDuration={delayDuration} content="編輯">
        <AlertDialogTrigger
          className="p-[10px]"
          onClick={(e) => {
            const figureAttr =
              editor?.isActive("figure") && editor?.getAttributes("figure");
            if (figureAttr) {
              if (figureAttr.caption) {
                setImageCaption(figureAttr.caption);
              }
              if (figureAttr.captionLink) {
                setImageLink(figureAttr.captionLink);
              }
            } else {
              setImageCaption("");
              setImageLink("");
            }
            setImageFigureOpen(true);
            e.stopPropagation();
          }}
        >
          <Pencil />
        </AlertDialogTrigger>
      </CustomTooltip>

      <AlertDialogContent
        className="w-[800px] min-h-[400px]"
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ maxWidth: "100vw" }}
      >
        <AlertDialogHeader className="">
          <AlertDialogTitle>
            <span>編輯圖片敘述</span>
          </AlertDialogTitle>
          <hr className="w-[106%] translate-x-[-3%]"></hr>
        </AlertDialogHeader>
        <div className="inputArea flex flex-col justify-center mt-3">
          <p className="text-lg mb-2">圖片敘述</p>
          <div className="flex items-center border border-neutral-400 rounded-md px-3 py-4 mb-4 text-center">
            <Pencil size={24}></Pencil>
            <input
              type="text"
              className="outline-none ms-2 text-lg pt-px w-full"
              value={imageCaption}
              placeholder="請輸入圖片敘述"
              onChange={(e) => {
                setImageCaption(e.target.value);
                if (e.target.value === "") {
                  setImageLink("");
                }
              }}
            />
          </div>

          <p className="text-lg mb-2">圖片敘述連結</p>
          <div
            className={`flex items-center border border-neutral-400 rounded-md px-3 py-4 mb-4 text-center ${
              linkDisabled ? "cursor-not-allowed bg-neutral-200" : ""
            }`}
          >
            <Link size={24}></Link>
            <input
              type="text"
              className={`outline-none ms-2 text-lg pt-px w-full ${
                linkDisabled
                  ? "cursor-not-allowed bg-neutral-200 pointer-events-none"
                  : ""
              }`}
              value={imageCaption.length === 0 ? "" : imageLink}
              placeholder="請輸入圖片敘述連結"
              onChange={(e) => {
                setImageLink(e.target.value);
              }}
            />
          </div>
        </div>
        <hr className="w-[106%] translate-x-[-3%] mt-5"></hr>
        <div className="flex justify-center items-center">
          <AlertDialogCancel
            className="rounded-xl text-black bg-white px-5 py-3 hover:bg-neutral-100 disabled:cursor-not-allowed"
            onClick={(e) => {
              const figureAttr = editor?.getAttributes("figure");
              setImageFigureOpen(false);
              e.stopPropagation();
            }}
          >
            <span>取消</span>
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-xl bg-white ms-3 px-5 py-3 enabled:hover:bg-black enabled:bg-neutral-700 enabled:text-white disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
            onClick={(e) => {
              handleSetImageCaption();
              setImageCaption("");
            }}
          >
            <span>確認</span>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImageCaptionDialog;
