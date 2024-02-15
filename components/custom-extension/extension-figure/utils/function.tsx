"use client";
import { Editor } from "@tiptap/react";

export const setNode = (
  editor: Editor | null,
  type: string,
  src: string,
  name: string,
  caption?: string,
  link?: string
) => {
  if (type === "image") {
    editor
      ?.chain()
      .focus()
      .setImage({
        src: src,
        fileName: name,
      })
      .run();
  } else {
    editor
      ?.chain()
      .focus()
      .setFigure({
        src: src,
        fileName: name,
        caption: caption,
        alt: caption,
        link: link,
      })
      .run();
  }
  editor?.commands.createParagraphNear();
};

export const deleteNode = (editor: Editor | null, type: string) => {
  if (editor) {
    editor.chain().focus().selectParentNode().deleteSelection().run();

    // if (type === "image") {
    //   const { state } = editor;
    //   const { from, to } = state.selection;
    //   console.log(`from:${from},to:${to}`);
    //   editor
    //     .chain()
    //     .focus()
    //     .createParagraphNear()
    //     .deleteRange({ from: from, to: to })
    //     .run();
    //   editor.chain().focus().selectParentNode().deleteSelection().run();
    // } else {
    //   editor.chain().focus().selectParentNode().deleteSelection().run();
    // }
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
// FileReader 壓縮 & 上傳
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
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageURL = event.target?.result as string;
      resolve(imageURL);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
