/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
// ImageUploadDialog.tsx
import React, { useState, useCallback, useEffect } from "react";
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
import { Table, TableBody, TableRow, TableCell } from "./ui/table";
import { FileSearch, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { type Editor } from "@tiptap/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { clsx } from "clsx";
import axios from "axios";
import * as DialogPrimitive from "@radix-ui/react-dialog";

type Props = {
  editor: Editor | null;
};
interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  description: string;
  user: {
    username: string;
  };
}
interface GiphyImage {
  id: string;
  images: {
    fixed_height_small: {
      url: string;
    };
  };
  title: string;
}

const ImageSearchDialog = ({ editor }: Props) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState("0");

  /* Unsplash Image Search */
  const [searchUnsplashImage, setSearchUnsplashImage] = useState("");
  const [totalUnsplashImages, setTotalUnsplashImages] = useState(0);
  const [totalPagesUnsplashImages, settotalPagesUnsplashImages] = useState(0);
  const [currPageUnsplashImages, setCurrPageUnsplashImages] = useState(1);
  const [resultUnsplash, setResultUnsplash] = useState<UnsplashImage[]>([]);
  const perpageUnsplashImages = 20;

  const performUnsplashSearch = (currPage: number, perPage: number) => {
    axios
      .get(
        `https://api.unsplash.com/search/photos/?page=${currPage}&query=${searchUnsplashImage}&per_page=${perPage}&client_id=365fb6cf7beeb53d0ed303f14c9fdf6a6d971b314373e046fcbdd39cacd0d62e`
      )
      .then((data) => {
        const result = data.data;
        setTotalUnsplashImages(result.total);
        settotalPagesUnsplashImages(result.total_pages);
        setResultUnsplash(result.results);
      })
      .catch((err) => {
        console.log("Error happened during fetching!", err);
      });
  };

  const handleUnsplashSearch = () => {
    setCurrPageUnsplashImages(1);
    performUnsplashSearch(currPageUnsplashImages, perpageUnsplashImages);
  };
  useEffect(() => {
    performUnsplashSearch(currPageUnsplashImages, perpageUnsplashImages);
  }, [currPageUnsplashImages]);

  useEffect(() => {
    if (searchUnsplashImage === "") {
      handleUnsplashSearch();
    }
  }, [searchUnsplashImage]);

  /* Giphy Image Search */
  const [searcGiphyImage, setSearchGiphyImage] = useState("");
  const [totalGiphyImages, setTotalGiphyImages] = useState(0);
  const [totalPagesGiphyImages, settotalPagesGiphyImages] = useState(0);
  const [currPageGiphyImages, setCurrPageGiphyImages] = useState(1);
  const [resultGiphy, setResultGiphy] = useState<GiphyImage[]>([]);
  const perpageGiphyImages = 20;
  const performGiphySearch = (currPage: number) => {
    axios
      .get(
        `https://api.giphy.com/v1/gifs/search?api_key=y1IAECJJz68f3xIdDy5eRQehtezIBAsS&q=${searcGiphyImage}&limit=${perpageGiphyImages}&offset=${
          currPage * perpageGiphyImages + 1
        }`
      )
      .then((data) => {
        const result = data.data;
        // console.log(result.data);

        setTotalGiphyImages(result.pagination.total_count);
        const totalPages = Math.ceil(
          result.pagination.total_count / result.pagination.count
        );
        settotalPagesGiphyImages(totalPages);
        setResultGiphy(result.data);
      })
      .catch((err) => {
        console.log("Error happened during fetching!", err);
      });
  };

  const handleGiphySearch = () => {
    setCurrPageGiphyImages(1);
    performGiphySearch(currPageGiphyImages);
  };
  useEffect(() => {
    performGiphySearch(currPageGiphyImages);
  }, [currPageGiphyImages]);
  useEffect(() => {
    if (searcGiphyImage === "") {
      handleGiphySearch();
    }
  }, [searcGiphyImage]);

  /* Both Event */
  const handleKeyDown = (e: any, type: string) => {
    if (e.key === "Enter") {
      if (type === "Unsplash") {
        handleUnsplashSearch();
      } else {
        handleGiphySearch();
      }
    }
  };

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
              <div className="searchArea flex justify-between items-center mt-4">
                <div className="flex items-centers rounded-xl border py-3 w-[88%]">
                  <Search className="mx-2" size={20}></Search>
                  <input
                    placeholder="建議以英文搜尋效果最佳"
                    className="outline-none w-full"
                    value={searchUnsplashImage}
                    onChange={(e) => setSearchUnsplashImage(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "Unsplash")}
                  />
                </div>
                <button
                  className="rounded-xl px-5 py-3 text-white bg-neutral-700 hover:bg-black cursor-pointer"
                  onClick={handleUnsplashSearch}
                >
                  搜尋
                </button>
              </div>
              <div className="resultArea mt-3">
                <div className="resultText flex justify-between items-center">
                  <span className="text-sm text-neutral-400">
                    共{totalUnsplashImages}張圖片
                  </span>
                  {totalUnsplashImages > 0 && (
                    <div className="flex">
                      <ChevronLeft
                        color={`${
                          currPageUnsplashImages === 1 ? "#ccc" : "black"
                        }`}
                        className={`${
                          currPageUnsplashImages === 1
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => {
                          setCurrPageUnsplashImages((prevPage) => prevPage - 1);
                        }}
                      ></ChevronLeft>
                      <ChevronRight
                        color={`${
                          currPageUnsplashImages === totalPagesUnsplashImages
                            ? "#ccc"
                            : "black"
                        }`}
                        className={`${
                          currPageUnsplashImages === totalPagesUnsplashImages
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => {
                          setCurrPageUnsplashImages((prevPage) => prevPage + 1);
                        }}
                      ></ChevronRight>
                    </div>
                  )}
                </div>
                <div className="resultImages columns-3 gap-4 mt-2">
                  {resultUnsplash &&
                    resultUnsplash.map((item) => (
                      <>
                        <button
                          className="mb-1 cursor-pointer"
                          onClick={() => {
                            editor &&
                              editor
                                .chain()
                                .focus()
                                .setImage({
                                  src: item.urls.regular,
                                  alt: item.description,
                                })
                                .run();
                            clearSearchValue();
                            setDialogIsOpen(false);
                          }}
                        >
                          <img
                            id={item.id}
                            key={item.id}
                            src={item.urls.small}
                            alt={item.description}
                          />
                        </button>
                      </>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="1">
              <div className="searchArea flex justify-between items-center mt-4">
                <div className="flex items-centers rounded-xl border py-3 w-[88%]">
                  <Search className="mx-2" size={20}></Search>
                  <input
                    placeholder="建議以英文搜尋效果最佳"
                    className="outline-none w-full"
                    value={searcGiphyImage}
                    onChange={(e) => setSearchGiphyImage(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "Giphy")}
                  />
                </div>
                <button
                  className="rounded-xl px-5 py-3 text-white bg-neutral-700 hover:bg-black cursor-pointer"
                  onClick={handleGiphySearch}
                >
                  搜尋
                </button>
              </div>
              <div className="resultArea mt-3">
                <div className="resultText flex justify-between items-center">
                  <span className="text-sm text-neutral-400">
                    共{totalGiphyImages}張圖片
                  </span>
                  {totalGiphyImages > 0 && (
                    <div className="flex">
                      <ChevronLeft
                        color={`${
                          currPageGiphyImages === 1 ? "#ccc" : "black"
                        }`}
                        className={`${
                          currPageGiphyImages === 1
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => {
                          setCurrPageGiphyImages((prevPage) => prevPage - 1);
                        }}
                      ></ChevronLeft>
                      <ChevronRight
                        color={`${
                          currPageGiphyImages === totalPagesGiphyImages
                            ? "#ccc"
                            : "black"
                        }`}
                        className={`${
                          currPageGiphyImages === totalPagesGiphyImages
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => {
                          setCurrPageGiphyImages((prevPage) => prevPage + 1);
                        }}
                      ></ChevronRight>
                    </div>
                  )}
                </div>
                <div className="resultImages columns-3 gap-4 mt-2">
                  {resultGiphy &&
                    resultGiphy.map((item) => (
                      <React.Fragment key={item.id}>
                        <button
                          className="mb-1 cursor-pointer w-full flex justify-center"
                          onClick={() => {
                            editor &&
                              editor
                                .chain()
                                .focus()
                                .setImage({
                                  src: item.images.fixed_height_small.url,
                                  alt: item.title,
                                })
                                .run();
                            clearSearchValue();
                            setDialogIsOpen(false);
                          }}
                        >
                          <img
                            id={item.id}
                            src={item.images.fixed_height_small.url}
                            alt={item.title}
                          />
                        </button>
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          {/* </DialogDescription> */}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ImageSearchDialog;
