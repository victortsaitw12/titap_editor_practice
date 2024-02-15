"use client";
import Tiptap from "@/components/Tiptap";
import { useContext, useEffect } from "react";
import MediaContentContext, {
  MediaContentProps,
} from "../context/mediaContentContext";
import LinkContext, { LinkProps } from "@/context/linkContext";
import EditorContentContext, {
  EditorContentProps,
} from "@/context/editorContext";

export default function Home() {
  const description = "Please Input Here";
  const { setIsOpen } = useContext<MediaContentProps | any>(
    MediaContentContext
  );
  const { setData } = useContext<EditorContentProps | any>(
    EditorContentContext
  );
  const { setLinkIsOpen } = useContext<LinkProps | any>(LinkContext);
  const onChnage = (richText: string) => {
    console.log("text changed");
    // console.log(richText);
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
    setData(description);
  }, []);

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
