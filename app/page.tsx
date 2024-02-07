"use client";
import Tiptap from "@/components/Tiptap";
import { useContext } from "react";
import MediaContentContext, {
  MediaContentProps,
} from "../context/mediaContentContext";
import LinkContext, { LinkProps } from "@/context/linkContext";

export default function Home() {
  const description = "Please Input Here";
  const { setIsOpen } = useContext<MediaContentProps | any>(
    MediaContentContext
  );
  const { setLinkIsOpen } = useContext<LinkProps | any>(LinkContext);
  const onChnage = (richText: string) => {
    console.log("text changed");
    // console.log(richText);
  };

  return (
    <main
      className="min-h-screen"
      onClick={(e) => {
        setIsOpen(false);
        setLinkIsOpen(false);
      }}
    >
      <Tiptap description={description} onChange={onChnage} />
    </main>
  );
}
