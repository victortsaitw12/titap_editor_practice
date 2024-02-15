"use client";
import React, { useState, ReactNode, createContext, useEffect } from "react";

export interface ImageData {
  file: string;
  name: string;
  alt?: string;
  size: number;
  blob: Blob;
}
export interface EditorContentProps {
  editorTitle: string;
  setEditorTitle: React.Dispatch<React.SetStateAction<string>>;
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
  editorImages: ImageData[];
  setEditorImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
}

const EditorContentContext = createContext<EditorContentProps | undefined>({
  editorTitle: "",
  setEditorTitle: function (): void {
    throw new Error("Function not implemented.");
  },
  data: "",
  setData: function (): void {
    throw new Error("Function not implemented.");
  },
  editorImages: [],
  setEditorImages: function (): void {
    throw new Error("Function not implemented.");
  },
});

interface ContainerProps {
  children: ReactNode;
}

// mediaContent為 + 多媒體content
export const EditorProvider = ({ children }: ContainerProps) => {
  const [editorTitle, setEditorTitle] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [editorImages, setEditorImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const editorContent = {
      editorTitle,
      content: { data },
      imageObject: { editorImages },
    };
    //   editorImages.map((item, index) => {
    //     console.log(
    //       `index:${index},name:${item.name}${
    //         item.alt ? ",alt:" + item.alt : ""
    //       },blob:${item.blob.size},${item.blob.type}`
    //     );
    //   });
    console.log("editorContent created:", editorContent);
  }, [editorTitle, data, editorImages]);

  return (
    <EditorContentContext.Provider
      value={{
        editorTitle,
        setEditorTitle,
        data,
        setData,
        editorImages,
        setEditorImages,
      }}
    >
      {children}
    </EditorContentContext.Provider>
  );
};
export default EditorContentContext;
