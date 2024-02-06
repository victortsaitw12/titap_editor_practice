"use client";
import React, { useState, ReactNode, createContext, useEffect } from "react";

export interface ImageData {
  file: string;
  alt?: string;
}
export interface EditorContentProps {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
  editorImages: ImageData[];
  setEditorImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
}

const EditorContentContext = createContext<EditorContentProps | undefined>({
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
  const [data, setData] = useState<string>("");
  const [editorImages, setEditorImages] = useState<ImageData[]>([]);

  // useEffect(() => {
  //   console.log("editorImages changed");
  //   console.log(`length:${editorImages.length}`);
  //   editorImages.map((item, index) => {
  //     console.log(`index:${index},name:${item.alt}`);
  //   });
  // }, [editorImages]);
  return (
    <EditorContentContext.Provider
      value={{ data, setData, editorImages, setEditorImages }}
    >
      {children}
    </EditorContentContext.Provider>
  );
};
export default EditorContentContext;
