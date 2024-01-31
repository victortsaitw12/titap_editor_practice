"use client";
import React, { useState, ReactNode, createContext } from "react";

export interface EditorContentProps {
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
}
const EditorContentContext = createContext<EditorContentProps | undefined>({
  data: "",
  setData: function (): void {
    throw new Error("Function not implemented.");
  },
});
interface ContainerProps {
  children: ReactNode;
}
// mediaContent為 + 多媒體content
export const EditorProvider = ({ children }: ContainerProps) => {
  const [data, setData] = useState<string>("");

  return (
    <EditorContentContext.Provider value={{ data, setData }}>
      {children}
    </EditorContentContext.Provider>
  );
};
export default EditorContentContext;
