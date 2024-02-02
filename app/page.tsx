"use client";
import Tiptap from "@/components/Tiptap";
import { useState, useEffect, useContext } from "react";
// import { clearInterval } from "timers";
import MediaContentContext, {
  MediaContentProps,
} from "../context/mediaContentContext";
import LinkContext, { LinkProps } from "@/context/linkContext";
import EditorContentContext, {
  EditorContentProps,
} from "@/context/editorContext";

export default function Home() {
  let timer: any;
  const [updateDt, setUpdateDt] = useState("");
  const description = "Please Input Here";
  const { setIsOpen } = useContext<MediaContentProps | any>(
    MediaContentContext
  );
  const { setLinkIsOpen, linkModify, setLinkModify } = useContext<
    LinkProps | any
  >(LinkContext);
  const { data, setData } = useContext<EditorContentProps | any>(
    EditorContentContext
  );
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
