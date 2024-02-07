/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { type Editor } from "@tiptap/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import axios from "axios";

type GiphySearchDialogProps = {
  editor: Editor | null;
  searcGiphyImage: string;
  setSearchGiphyImage: React.Dispatch<React.SetStateAction<string>>;
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clearSearchValue: () => void;
};
interface GiphyImage {
  id: string;
  images: {
    fixed_height_small: {
      url: string;
    };
  };
  title: string;
}

const Giphy = ({
  editor,
  searcGiphyImage,
  setSearchGiphyImage,
  setDialogIsOpen,
  clearSearchValue,
}: GiphySearchDialogProps) => {
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

  return (
    <>
      <div className="searchArea flex justify-between items-center mt-4">
        <div className="flex items-centers rounded-xl border py-3 w-[88%]">
          <Search className="mx-2" size={20}></Search>
          <input
            placeholder="建議以英文搜尋效果最佳"
            className="outline-none w-full"
            value={searcGiphyImage}
            onChange={(e) => setSearchGiphyImage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGiphySearch()}
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
                color={`${currPageGiphyImages === 1 ? "#ccc" : "black"}`}
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
                          fileName: item.id,
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
    </>
  );
};

export default Giphy;
