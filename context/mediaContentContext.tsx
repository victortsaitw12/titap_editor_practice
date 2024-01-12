"use client";
import React, { useState, ReactNode, createContext } from "react";

export interface MediaContentProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const MediaContentContext = createContext<MediaContentProps | undefined>({
  isOpen: false,
  setIsOpen: function (): void {
    throw new Error("Function not implemented.");
  },
});
interface ContainerProps {
  children: ReactNode;
}

export const MediaContextProvider = ({ children }: ContainerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <MediaContentContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MediaContentContext.Provider>
  );
};
export default MediaContentContext;
