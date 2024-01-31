"use client";
import Tiptap from "@/components/Tiptap";
import { Button } from "../components/ui/button";
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
  const updateContent = () => {
    timer = setInterval(() => {
      let now = new Date();
      let hour = now.getHours();
      let min = now.getMinutes();
      setUpdateDt(hour + ":" + min);
    }, 1000);
  };

  useEffect(() => {
    updateContent();
    return () => clearInterval(timer);
  }, []);

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
      <div className="head">
        <div>{updateDt} 已自動儲存</div>
        <Button
          onClick={() => {
            console.log(data);
          }}
        >
          準備發佈
        </Button>
      </div>
      <Tiptap description={description} onChange={onChnage} />
    </main>
  );
}
