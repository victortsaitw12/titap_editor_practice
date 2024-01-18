"use client";
import React, { useState, ReactNode, createContext, useEffect } from "react";

export interface LinkProps {
  linkIsOpen: boolean;
  setLinkIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  linkModify: boolean;
  setLinkModify: React.Dispatch<React.SetStateAction<boolean>>;
}
const LinkContext = createContext<LinkProps | undefined>({
  linkIsOpen: false,
  setLinkIsOpen: function (): void {
    throw new Error("Function not implemented.");
  },
  linkModify: false,
  setLinkModify: function (): void {
    throw new Error("Function not implemented.");
  },
});
interface ContainerProps {
  children: ReactNode;
}

export const LinkProvider = ({ children }: ContainerProps) => {
  const [linkIsOpen, setLinkIsOpen] = useState<boolean>(false);
  const [linkModify, setLinkModify] = useState<boolean>(false);

  return (
    <LinkContext.Provider
      value={{ linkIsOpen, setLinkIsOpen, linkModify, setLinkModify }}
    >
      {children}
    </LinkContext.Provider>
  );
};
export default LinkContext;
