import { Editor } from "@tiptap/react";

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
