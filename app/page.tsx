"use client"
import Tiptap from "@/components/Tiptap"
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
// import { clearInterval } from "timers";

export default function Home() {
  let timer: any;
  const [updateDt, setUpdateDt] = useState("");

  const description="Please Input Here";
  const updateContent = () => {
    timer = setInterval(() => {
      let now = new Date();
      let hour = now.getHours();
      let min = now.getMinutes();
      setUpdateDt(hour + ":" + min);
    }, 1000);
  }
  useEffect(() => {
    updateContent();
    return () => clearInterval(timer);
  }, []);
  
  const onChnage = (richText: string) => {
    console.log("text changed")
    console.log(richText);
  }


  return (
    <main className="min-h-screen">
      <div className="head">
          <div>
              {updateDt} 已自動儲存
          </div>
          <Button>準備發佈</Button>
      </div>
      <Tiptap description={description} onChange={onChnage}/>
    </main>
  )
}
