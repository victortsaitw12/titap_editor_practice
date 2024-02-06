"use client";
import EditorContentContext, {
  EditorContentProps,
} from "@/context/editorContext";
import { Editor } from "@tiptap/react";
import { useContext } from "react";

export const setNode = (
  editor: Editor | null,
  type: string,
  src: string,
  alt: string,
  caption?: string,
  link?: string
) => {
  if (type === "image") {
    editor
      ?.chain()
      .focus()
      .setImage({
        src: src,
        alt: alt,
      })
      .run();
  } else {
    editor
      ?.chain()
      .focus()
      .setFigure({
        src: src,
        caption: caption,
        alt: alt,
        link: link,
      })
      .run();
  }
  editor?.commands.createParagraphNear();
};

export const deleteNode = (editor: Editor | null, type: string) => {
  if (editor) {
    if (type === "image") {
      const { state } = editor;
      const { from, to } = state.selection;
      editor
        .chain()
        .focus()
        .createParagraphNear()
        .deleteRange({ from: from, to: to })
        .run();
    } else {
      editor.chain().focus().selectParentNode().deleteSelection().run();
    }
  }
};

export const changeNodeClass = (
  editor: Editor | null,
  type: string,
  changeType: string
) => {
  if (type === "image") {
    if (changeType === "fullScreen") {
      editor?.chain().focus().setImageClass({ customClass: "fullImage" }).run();
    } else {
      editor?.chain().focus().setImageClass({ customClass: "" }).run();
    }
  } else {
    if (changeType === "fullScreen") {
      editor
        ?.chain()
        .focus()
        .setFigureClass({ customClass: "fullFigure" })
        .run();
    } else {
      editor?.chain().focus().setFigureClass({ customClass: "" }).run();
    }
  }
};

export const compressImage = (image: any, scale: number, factor: number) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const cvWidth = image.width * (1 - scale + factor);
  const cvHeight = image.height * (1 - scale + factor);
  canvas.width = cvWidth;
  canvas.height = cvHeight;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // 取得壓縮後的Data URL
  return canvas.toDataURL("image/jpeg");
};

export const upload = (file: File) => {
  const fileSize = file.size / 1024; //KB
  const maxSize = 200;
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log(`fileSize:${fileSize}`);
      if (fileSize > 200) {
        const scale = (fileSize - maxSize) / fileSize;
        const factor = 0.18;
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.onload = () => {
          const compressedDataURL = compressImage(img, scale, factor);

          resolve(compressedDataURL);
        };
      } else {
        const imageURL = event.target?.result as string;
        resolve(imageURL);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
