"use client";
import React, { useState, ReactNode, createContext, useEffect } from "react";

export interface MediaContentProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDisabled: boolean;
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}
const MediaContentContext = createContext<MediaContentProps | undefined>({
  isOpen: false,
  setIsOpen: function (): void {
    throw new Error("Function not implemented.");
  },
  isDisabled: true,
  setIsDisabled: function (): void {
    throw new Error("Function not implemented.");
  },
});
interface ContainerProps {
  children: ReactNode;
}
// mediaContent為 + 多媒體content
export const MediaContextProvider = ({ children }: ContainerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  return (
    <MediaContentContext.Provider
      value={{ isOpen, setIsOpen, isDisabled, setIsDisabled }}
    >
      {children}
    </MediaContentContext.Provider>
  );
};
export default MediaContentContext;
