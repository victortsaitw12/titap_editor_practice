/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { type Editor } from "@tiptap/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import axios from "axios";

type UnsplashSearchDialogProps = {
  editor: Editor | null;
  searchUnsplashImage: string;
  setSearchUnsplashImage: React.Dispatch<React.SetStateAction<string>>;
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clearSearchValue: () => void;
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

const Unsplash = ({
  editor,
  searchUnsplashImage,
  setSearchUnsplashImage,
  setDialogIsOpen,
  clearSearchValue,
}: UnsplashSearchDialogProps) => {
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

  return (
    <>
      <div className="searchArea flex justify-between items-center mt-4">
        <div className="flex items-centers rounded-xl border py-3 w-[88%]">
          <Search className="mx-2" size={20}></Search>
          <input
            placeholder="建議以英文搜尋效果最佳"
            className="outline-none w-full"
            value={searchUnsplashImage}
            onChange={(e) => setSearchUnsplashImage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnsplashSearch()}
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
                color={`${currPageUnsplashImages === 1 ? "#ccc" : "black"}`}
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
              <React.Fragment key={item.id}>
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
                          fileName: item.id,
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
              </React.Fragment>
            ))}
        </div>
      </div>
    </>
  );
};

export default Unsplash;
