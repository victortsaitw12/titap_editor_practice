// ImageUploadDialog.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogOverlay, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableRow, TableCell } from './ui/table';
import { FileSearch, Search } from 'lucide-react';
import { type Editor } from "@tiptap/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { clsx } from 'clsx';
import axios from 'axios';

type Props = {
    editor: Editor | null
}

const ImageSearchDialog = ({ editor }: Props) => {
    const [activeIndex, setActiveIndex] = useState("0");
    const [searchUnsplashImage, setSearchUnsplashImage] = useState("");
    const [totalUnsplashImages, setTotalUnsplashImages] = useState(0)
    const [perpageUnsplashImages, setPerpageUnsplashImages] = useState(20)
    const [searcGiphyImage, setSearchGiphyImage] = useState("");
    const [totalGiphyImages, setTotalGiphyImages] = useState(0)
    const [perpageGiphyImages, setPerpageGiphyImages] = useState(20)

    const handleUnsplashSearch = () => {
        // 在這裡使用 searchValue，例如發送 API 請求、處理搜索邏輯等
        console.log("Unsplash搜尋值：", searchUnsplashImage);
        
        const performSearch = (query:string) => {
            axios
              .get(
                `https://api.unsplash.com/search/photos/?page=1&query=${query}&per_page=20&client_id=365fb6cf7beeb53d0ed303f14c9fdf6a6d971b314373e046fcbdd39cacd0d62e`
              )
              .then(data => {
                // this.setState({ imgs: data.data.results });
                console.log(data.data)
                const result = data.data.results;
                setTotalUnsplashImages(data.data.total)
              })
              .catch(err => {
                console.log('Error happened during fetching!', err);
              });
          };
          performSearch(searchUnsplashImage)
    };
    const handleGiphySearch = () => {
        // 在這裡使用 searchValue，例如發送 API 請求、處理搜索邏輯等
        console.log("Giphy搜尋值：", searcGiphyImage);
        console.log("url:" + `https://giphy.com/search/${searcGiphyImage}`)
        
    };
    const handleKeyDown = (e: any, type: string) => {
        if (e.key === "Enter") {
            if (type === "Unsplash") {
                handleUnsplashSearch();
            } else {
                handleGiphySearch();
            }

        }
    };


    return (
        <Dialog>
            <DialogTrigger className='p-[10px]'>
                <FileSearch className='w-4 h-4' />
            </DialogTrigger>
            <DialogContent className='dialogContent w-[800px]'>
                <DialogHeader className=''>
                    <DialogTitle>
                        <span>搜尋免費圖庫或 GIF</span>
                    </DialogTitle>
                    <hr className='w-[106%] translate-x-[-3%]'></hr>
                </DialogHeader>
                {/* <DialogDescription> */}
                <Tabs value={activeIndex} onValueChange={setActiveIndex} className='h-[700px]'>
                    <TabsList className='bg-white'>
                        <TabsTrigger value="0" className=''>
                            <svg width="16" height="16" viewBox="0 0 32 32" version="1.1" aria-labelledby="unsplash-home" aria-hidden="false">
                                <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path>
                            </svg>
                            <span className='ms-2'>Unsplash</span>
                        </TabsTrigger>
                        <TabsTrigger value="1">
                            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 35" className="sc-1f039a7e-2 bMXkCi">
                                <g fillRule="evenodd" clipRule="evenodd">
                                    <path fill="#00ff99" d="M0 3h4v29H0z"></path>
                                    <path fill="#9933ff" d="M24 11h4v21h-4z"></path>
                                    <path fill="#00ccff" d="M0 31h28v4H0z"></path>
                                    <path fill="#fff35c" d="M0 0h16v4H0z"></path>
                                    <path fill="#ff6666" d="M24 8V4h-4V0h-4v12h12V8"></path>
                                    <path className="shadow" d="M24 16v-4h4M16 0v4h-4"></path>
                                </g>
                            </svg>
                            <span className='ms-2'>Giphy</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="0">
                        <div className='searchUnsplashText flex justify-between items-center mt-4'>
                            <div className='flex items-centers rounded-xl border py-3 w-[88%]'>
                                <Search className='mx-2' size={20}></Search>
                                <input placeholder='建議以英文搜尋效果最佳' className='outline-none w-full' value={searchUnsplashImage}
                                    onChange={(e) => setSearchUnsplashImage(e.target.value)} onKeyDown={(e) => handleKeyDown(e, "Unsplash")} />
                            </div>
                            <button className='rounded-xl px-5 py-3 text-white bg-neutral-700 hover:bg-black cursor-pointer' onClick={handleUnsplashSearch}>搜尋</button>
                        </div>
                        <div className='searchUnsplashResult'></div>
                    </TabsContent>
                    <TabsContent value="1">
                        <div className='searchGiphyText flex justify-between items-center mt-4'>
                            <div className='flex items-centers rounded-xl border py-3 w-[88%]'>
                                <Search className='mx-2' size={20}></Search>
                                <input placeholder='建議以英文搜尋效果最佳' className='outline-none w-full' value={searcGiphyImage} onChange={(e) => setSearchGiphyImage(e.target.value)} onKeyDown={(e) => handleKeyDown(e, "Giphy")} />
                            </div>
                            <button className='rounded-xl px-5 py-3 text-white bg-neutral-700 hover:bg-black cursor-pointer' onClick={handleGiphySearch}>搜尋</button>
                        </div>
                        <div className='searchGiphyResult'></div>
                    </TabsContent>
                </Tabs>
                {/* </DialogDescription> */}
            </DialogContent>
        </Dialog>
    );
};

export default ImageSearchDialog;
