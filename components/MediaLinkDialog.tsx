/* eslint-disable @next/next/no-img-element */
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
import { Link, AlertTriangle } from "lucide-react";
import { type Editor } from "@tiptap/react";
import { Table, TableBody, TableRow, TableCell } from "./ui/table";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { Skeleton } from "./ui/skeleton";
import {
  FACEBOOK_POST_REGEX,
  FACEBOOK_VIDEO_REGEX,
} from "./custom-extension/extension-facebook";
import { TWITTER_REGEX } from "./custom-extension/extension-twitter";
import { INSTAGRAM_REGEX } from "./custom-extension/extension-instagram";

type Props = {
  editor: Editor | null;
};

const MediaLinkDialog = ({ editor }: Props) => {
  const [mediaLinkValue, setMediaLinkValue] = useState("");
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [mediaLinkCheck, setMediaLinkCheck] = useState(true);
  const YOUTUBE_REGEX =
    /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be)\/(?!channel\/)(?!@)(.+)?$/;

  const handleNewMedia = () => {
    editor && editor.chain().focus().enter().run();
    setMediaDialogOpen(false);
    setMediaLinkValue("");
    setMediaLinkCheck(true);
  };
  const handleMediaLink = () => {
    if (editor) {
      if (mediaLinkValue.match(YOUTUBE_REGEX)) {
        editor.commands.setYoutubeVideo({
          src: mediaLinkValue,
          width: 740,
        });
      } else if (mediaLinkValue.match(TWITTER_REGEX)) {
        editor.commands.setTwitterPost({
          src: mediaLinkValue,
        });
      } else if (mediaLinkValue.match(INSTAGRAM_REGEX)) {
        editor.commands.setInstagramPost({
          src: mediaLinkValue,
        });
      } else if (
        mediaLinkValue.match(FACEBOOK_VIDEO_REGEX) ||
        mediaLinkValue.match(FACEBOOK_POST_REGEX)
      ) {
        editor.commands.setFacebook({
          src: mediaLinkValue,
        });
      } else {
        setMediaLinkCheck(false);
        return;
      }
      handleNewMedia();
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="p-[10px]"
        onClick={() => {
          setMediaDialogOpen(true);
          setMediaLinkValue("");
          setMediaLinkCheck(true);
        }}
      >
        <Link className="w-4 h-4" />
      </DialogTrigger>
      {mediaDialogOpen && (
        <DialogContent className="w-[800px] min-h-[500px]">
          <DialogHeader className="h-[30px]">
            <span>嵌入網站的內容</span>
            <hr className="w-[106%] translate-x-[-3%]"></hr>
          </DialogHeader>
          <div className="px-4 flex flex-col">
            <div className="linkInputArea flex items-start justify-between px-3">
              <div className="w-[85%] flex flex-col h-[65px]">
                <div
                  className={`w-full border rounded-xl py-3 px-5 ${
                    !mediaLinkCheck && "border-red-300"
                  }`}
                >
                  <input
                    type="text"
                    className="outline-none w-full"
                    placeholder="請輸入欲嵌入的連結 ..."
                    value={mediaLinkValue}
                    onChange={(e) => setMediaLinkValue(e.target.value)}
                    onInput={() => {
                      setMediaLinkCheck(true);
                    }}
                  />
                </div>
                {!mediaLinkCheck && (
                  <div className="text-red-600 flex items-center text-sm mt-1">
                    <AlertTriangle size={20}></AlertTriangle>
                    {/* <Skeleton></Skeleton> */}
                    <span className="ms-2">
                      讀取網頁發生錯誤，請檢查網址是否正確。
                    </span>
                  </div>
                )}
              </div>
              <button
                className="rounded-xl px-7 py-3 text-white bg-neutral-700 hover:bg-black cursor-pointer"
                onClick={handleMediaLink}
              >
                完成
              </button>
            </div>

            <div className="px-3 mt-2">
              <p className="text-sm text-neutral-500">
                連結權限須為「公開（任何擁有連結者皆可存取）」才能正常顯示。
                目前支援下列網站來源的嵌入格式，其餘來源將以預設格式顯示。
              </p>
            </div>
            <div className="h-[270px]">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-[150px] cursor-pointer">
                      <a href="https://www.youtube.com/" target="_blank">
                        <div className="flex items-center">
                          <img
                            src="https://www.youtube.com/s/desktop/d92f5e6b/img/favicon_96x96.png"
                            alt="YouTube"
                            className="w-[16px] h-[16px] hover:shadow-none"
                          />
                          <p className="ms-3">YouTube</p>
                        </div>
                      </a>
                    </TableCell>
                    <TableCell>嵌入影片或播放清單</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-[150px] cursor-pointer">
                      <a href="https://twitter.com/" target="_blank">
                        <div className="flex items-center">
                          <img
                            src="https://abs.twimg.com/responsive-web/client-web-legacy/icon-ios.b1fc7278.png"
                            alt="Twitter"
                            className="w-[16px] h-[16px] hover:shadow-none"
                          />
                          <p className="ms-3">Twitter</p>
                        </div>
                      </a>
                    </TableCell>
                    <TableCell>嵌入單一則 Tweet 貼文</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-[150px] cursor-pointer">
                      <a href="https://www.instagram.com/" target="_blank">
                        <div className="flex items-center">
                          <img
                            src="https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png"
                            alt="Instagram"
                            className="w-[16px] h-[16px] hover:shadow-none"
                          />
                          <p className="ms-3">Instagram</p>
                        </div>
                      </a>
                    </TableCell>
                    <TableCell>嵌入單一則 Instagram 貼文</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-[150px] cursor-pointer">
                      <a href="https://www.facebook.com/" target="_blank">
                        <div className="flex items-center">
                          <img
                            src="https://static.xx.fbcdn.net/rsrc.php/yT/r/aGT3gskzWBf.ico"
                            alt="Facebook"
                            className="w-[16px] h-[16px] hover:shadow-none"
                          />
                          <p className="ms-3">Facebook</p>
                        </div>
                      </a>
                    </TableCell>
                    <TableCell>嵌入單一則 Facebook 貼文</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
export default MediaLinkDialog;
