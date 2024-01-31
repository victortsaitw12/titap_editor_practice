// ImageUploadDialog.tsx
import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogOverlay,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Table, TableBody, TableRow, TableCell } from "./ui/table";
import {
  Image,
  Info,
  Pencil,
  Link,
  ArrowDownUp,
  Trash,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { type Editor } from "@tiptap/react";
import MediaContentContext, {
  MediaContentProps,
} from "@/context/mediaContentContext";
import { setNode } from "./custom-extension/extension-figure/utils/function";

type ImageCaptionDialogProps = {
  editor: Editor | null;
  imageFigureOpen: boolean;
  setImageFigureOpen: Dispatch<SetStateAction<boolean>>;
};

const ImageCaptionDialog = ({
  editor,
  imageFigureOpen,
  setImageFigureOpen,
}: ImageCaptionDialogProps) => {
  const [imageCaption, setImageCaption] = useState("");
  const [imageLink, setImageLink] = useState("");
  useEffect(() => {
    const figureAttr = editor?.getAttributes("figure");
    if (figureAttr) {
      if (figureAttr.caption) {
        setImageCaption(figureAttr.caption);
      }
      if (figureAttr.captionLink) {
        setImageLink(figureAttr.captionLink);
      }
    }
  }, []);

  const handleSetImageCaption = () => {
    const imageSrc = editor?.isActive("figure")
      ? editor?.getAttributes("figure").src
      : editor?.isActive("image")
      ? editor?.getAttributes("image").src
      : "";
    const imageAlt = editor?.isActive("figure")
      ? editor?.getAttributes("figure").alt
      : editor?.isActive("image")
      ? editor?.getAttributes("image").alt
      : "";
    editor?.chain().lift("figure").deleteSelection().run();
    if (imageCaption) {
      setNode(editor, "figure", imageSrc, imageAlt, imageCaption, imageLink);
    } else {
      setNode(editor, "image", imageSrc, imageAlt);
    }
    setImageFigureOpen(false);
  };
  const linkDisabled = imageCaption.length === 0;

  return (
    <Dialog>
      <DialogTrigger
        className="p-[10px]"
        onClick={(e) => {
          setImageFigureOpen(true);
          e.stopPropagation();
        }}
      >
        <Pencil />
      </DialogTrigger>
      <DialogContent className="w-[800px] min-h-[400px]">
        <DialogHeader className="">
          <DialogTitle>
            <span>編輯圖片敘述</span>
          </DialogTitle>
          <hr className="w-[106%] translate-x-[-3%]"></hr>
        </DialogHeader>
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
          <DialogClose className="rounded-xl text-black bg-white px-5 py-3 hover:bg-neutral-100 disabled:cursor-not-allowed">
            <span
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              取消
            </span>
          </DialogClose>
          <DialogClose className="rounded-xl bg-white ms-3 px-5 py-3 enabled:hover:bg-black enabled:bg-neutral-700 enabled:text-white disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400">
            <span
              onClick={(e) => {
                handleSetImageCaption();
              }}
            >
              確認
            </span>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCaptionDialog;
