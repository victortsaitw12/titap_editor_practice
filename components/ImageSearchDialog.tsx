/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
// ImageUploadDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogOverlay,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { FileSearch } from "lucide-react";
import { type Editor } from "@tiptap/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import Giphy from "./dialogContent/ImageSearch/Giphy";
import Unsplash from "./dialogContent/ImageSearch/Unsplash";

type Props = {
  editor: Editor | null;
};

const ImageSearchDialog = ({ editor }: Props) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState("0");

  /* Unsplash Image Search */
  const [searchUnsplashImage, setSearchUnsplashImage] = useState("");

  /* Giphy Image Search */
  const [searcGiphyImage, setSearchGiphyImage] = useState("");

  /* Both Event */
  const clearSearchValue = () => {
    setSearchUnsplashImage("");
    setSearchGiphyImage("");
  };

  return (
    <Dialog>
      <DialogTrigger
        className="p-[10px]"
        onClick={() => {
          setDialogIsOpen(true);
          clearSearchValue();
        }}
      >
        <FileSearch className="w-4 h-4" />
      </DialogTrigger>
      {dialogIsOpen && (
        <DialogContent className="dialogContent w-[800px] overflow-y-scroll">
          <DialogHeader className="">
            <DialogTitle>
              <span>搜尋免費圖庫或 GIF</span>
            </DialogTitle>
            <hr className="w-[106%] translate-x-[-3%]"></hr>
          </DialogHeader>
          {/* <DialogDescription> */}
          <Tabs
            value={activeIndex}
            onValueChange={setActiveIndex}
            className="h-[700px]"
          >
            <TabsList className="bg-white">
              <TabsTrigger value="0" onClick={clearSearchValue}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 32 32"
                  version="1.1"
                  aria-labelledby="unsplash-home"
                  aria-hidden="false"
                >
                  <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path>
                </svg>
                <span className="ms-2">Unsplash</span>
              </TabsTrigger>
              <TabsTrigger value="1" onClick={clearSearchValue}>
                <svg
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 28 35"
                  className="sc-1f039a7e-2 bMXkCi"
                >
                  <g fillRule="evenodd" clipRule="evenodd">
                    <path fill="#00ff99" d="M0 3h4v29H0z"></path>
                    <path fill="#9933ff" d="M24 11h4v21h-4z"></path>
                    <path fill="#00ccff" d="M0 31h28v4H0z"></path>
                    <path fill="#fff35c" d="M0 0h16v4H0z"></path>
                    <path fill="#ff6666" d="M24 8V4h-4V0h-4v12h12V8"></path>
                    <path className="shadow" d="M24 16v-4h4M16 0v4h-4"></path>
                  </g>
                </svg>
                <span className="ms-2">Giphy</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="0">
              <Unsplash
                editor={editor}
                searchUnsplashImage={searchUnsplashImage}
                setSearchUnsplashImage={setSearchUnsplashImage}
                setDialogIsOpen={setDialogIsOpen}
                clearSearchValue={clearSearchValue}
              ></Unsplash>
            </TabsContent>
            <TabsContent value="1">
              <Giphy
                editor={editor}
                searcGiphyImage={searcGiphyImage}
                setSearchGiphyImage={setSearchGiphyImage}
                setDialogIsOpen={setDialogIsOpen}
                clearSearchValue={clearSearchValue}
              ></Giphy>
            </TabsContent>
          </Tabs>
          {/* </DialogDescription> */}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ImageSearchDialog;
