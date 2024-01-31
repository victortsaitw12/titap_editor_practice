// ImageUploadDialog.tsx
import React, { useState, useCallback, useEffect, useContext } from "react";
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
import {
  Image,
  Info,
  Pencil,
  Link,
  ArrowDownUp,
  Trash,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { type Editor } from "@tiptap/react";
import MediaContentContext, {
  MediaContentProps,
} from "@/context/mediaContentContext";
import { setNode } from "./custom-extension/extension-figure/utils/function";

type Props = {
  editor: Editor | null;
};

const ImageUploadDialog = ({ editor }: Props) => {
  const [imageLinkDisabled, setImageLinkDisabled] = useState<
    { disabled: boolean }[]
  >([{ disabled: true }]);
  const [selectedImages, setSelectedImages] = useState<
    { file: string; alt: string }[]
  >([]);
  const [imagesDescription, setImagesDescription] = useState<
    { caption: string; link: string }[]
  >([]);
  const { setIsOpen } = useContext<MediaContentProps | any>(
    MediaContentContext
  );

  const upload = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageURL = event.target?.result as string;
        resolve(imageURL);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  const addImageToDialog = (url: string, altText: string) => {
    setSelectedImages((prevImages) => [
      ...prevImages,
      {
        file: url,
        alt: altText,
      },
    ]);
    setImageLinkDisabled((prevImages) => [
      ...prevImages,
      {
        disabled: true,
      },
    ]);
  };
  const addImageToEditor = (
    images: { file: string; alt: string }[],
    imagesDescription: { caption: string; link: string }[]
  ) => {
    if (editor && images) {
      images.map((item, index) => {
        if (imagesDescription[index]) {
          setNode(
            editor,
            "figure",
            item.file,
            item.alt,
            imagesDescription[index]?.caption,
            imagesDescription[index]?.link
          );
        } else {
          setNode(editor, "image", item.file, item.alt);
        }
      });
      setSelectedImages([]);
      setImagesDescription([]);
      setImageLinkDisabled([{ disabled: true }]);
    }
  };
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    let oversizeImage = "";
    if (uploadFiles) {
      for (let i = 0; i < uploadFiles.length; i++) {
        const currentFile = uploadFiles[i];
        const maxSizeInBytes = 500 * 1024; // 500KB

        if (currentFile.size > maxSizeInBytes) {
          oversizeImage += currentFile.name;
          oversizeImage += ",";
          continue;
        }
        upload(currentFile)
          .then((res) => addImageToDialog(res, currentFile.name))
          .catch((err) => console.error(err));
      }
      if (oversizeImage) {
        alert("無法上傳" + oversizeImage + "圖片大於500KB");
      }
    }
    return;
  };
  const handleImageLink = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const imageDescription = e.target.value;

    // 改 caption
    const updatedImageDescription = [...imagesDescription];
    updatedImageDescription[index] = {
      ...updatedImageDescription[index],
      caption: imageDescription,
    };
    if (imageDescription.length === 0) {
      updatedImageDescription[index].link = "";
    }
    setImagesDescription(updatedImageDescription);

    // 改 link disabled狀態
    const updatedImageLinkDisabled = [...imageLinkDisabled];
    updatedImageLinkDisabled[index] = {
      disabled: imageDescription.length > 0 ? false : true,
    };
    setImageLinkDisabled(updatedImageLinkDisabled);
  };
  const handleImageLinkValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const imageLink = e.target.value;
    const updateImageLink = [...imagesDescription];
    updateImageLink[index] = {
      ...updateImageLink[index],
      link: imageLink,
    };
    setImagesDescription(updateImageLink);
  };
  const handleTrashClick = (index: number) => {
    setSelectedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="p-[10px]">
        <Image aria-label="image" className="w-4 h-4" />
      </DialogTrigger>

      <DialogContent className="w-[800px] min-h-[580px]">
        <DialogHeader className="">
          <DialogTitle>
            <span>上傳圖片</span>
          </DialogTitle>
          <hr className="w-[106%] translate-x-[-3%]"></hr>
        </DialogHeader>
        <div>
          <div
            className={`uploadImageArea w-[100%] ${
              selectedImages.length > 0 ? "h-[175px] mt-3" : "h-[290px] mt-5"
            }  border-dashed border-2 rounded-lg mb-3 relative`}
          >
            <div className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col items-center">
              <Image
                aria-label="image"
                className="w-12 h-12 text-neutral-400"
              />
              <span className="text-neutral-400 text-base">
                請點擊選取檔案，於此進行上傳
              </span>
              <label
                className={`mt-4 px-3 py-2 text-sm rounded-lg border ${
                  selectedImages.length >= 10
                    ? "cursor-not-allowed bg-neutral-100 border-neutral-100 text-neutral-400"
                    : "cursor-pointer hover:bg-neutral-100  border-black text-black"
                }`}
              >
                選取檔案
                <input
                  className="hidden"
                  type="file"
                  onChange={handleAddImage}
                  accept="image/jpeg, image/png, image/gif"
                  multiple
                  disabled={selectedImages.length >= 10 ? true : false}
                />
              </label>
            </div>
          </div>
          <div className="flex items-center text-neutral-400 mb-3">
            {selectedImages.length <= 10 ? (
              <>
                <Info className="w-5 h-5"></Info>
                <span className="ms-1 text-sm">
                  圖片最多為 10 張，格式僅接受 jpg, png, gif。
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5"></AlertTriangle>
                <span className="ms-1">最多一次上傳 10 張圖片</span>
              </>
            )}
          </div>
          {selectedImages.length > 0 && <hr></hr>}
          <div className={"max-h-[310px] overflow-y-scroll overflow-x-hidden"}>
            <Table>
              <TableBody>
                {selectedImages.map((image, index) => (
                  <TableRow key={index}>
                    {image && (
                      <>
                        <TableCell className="ps-[5px] pe-[10px] text-lg">
                          {index + 1}
                        </TableCell>
                        <TableCell className="px-0">
                          <div className="border rounded-md p-2 border-neutral-400">
                            <ArrowDownUp className="w-4 h-4"></ArrowDownUp>
                          </div>
                        </TableCell>
                        <TableCell className="ps-[10px] pe-[10px] w-[35%]">
                          <div className="flex items-center border rounded-xl px-3 py-2">
                            <Pencil className="w-4 h-4"></Pencil>
                            <input
                              placeholder="請輸入圖片敘述"
                              className="border-0 focus:border-0 ms-2 w-[75%] outline-none"
                              onChange={(e) => handleImageLink(e, index)}
                            />
                          </div>
                        </TableCell>
                        <TableCell
                          className={`ps-[1px] pe-[10px] w-[35%] ${
                            imageLinkDisabled[index]?.disabled
                              ? "opacity-70"
                              : ""
                          }`}
                        >
                          <div
                            className={`flex items-center border rounded-xl px-3 py-2 ${
                              imageLinkDisabled[index]?.disabled
                                ? "bg-neutral-300"
                                : ""
                            }`}
                          >
                            <Link className="w-4 h-4"></Link>
                            <input
                              placeholder="請輸入連結，例：https://..."
                              className={`border-0 focus:border-0 ms-2 w-[75%] ${
                                imageLinkDisabled[index]?.disabled
                                  ? "cursor-not-allowed "
                                  : ""
                              } outline-none`}
                              disabled={imageLinkDisabled[index]?.disabled}
                              onChange={(e) => handleImageLinkValue(e, index)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="ps-0 pe-[10px]">
                          <CheckCircle2 color="green"></CheckCircle2>
                        </TableCell>
                        <TableCell className="px-0">
                          <img src={image.file} alt={image.alt} className="" />
                        </TableCell>
                        <TableCell className="pe-0 ps-[10px]">
                          <div className="border rounded-md p-2 border-neutral-400">
                            <Trash
                              className="cursor-pointer"
                              onClick={() => handleTrashClick(index)}
                            ></Trash>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <hr className="w-[106%] translate-x-[-3%]"></hr>
        <div className="flex justify-center items-center">
          <DialogClose className="rounded-xl text-black bg-white px-5 py-3 hover:bg-neutral-100 disabled:cursor-not-allowed">
            <span
              onClick={(e) => {
                setSelectedImages([]);
                setIsOpen(false);
                e.stopPropagation();
              }}
            >
              取消
            </span>
          </DialogClose>
          <DialogClose
            className="rounded-xl bg-white ms-3 px-5 py-3 enabled:hover:bg-black enabled:bg-neutral-700 enabled:text-white disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
            disabled={
              selectedImages.length > 0 && selectedImages.length <= 10
                ? false
                : true
            }
            onClick={(e) => {
              addImageToEditor(selectedImages, imagesDescription);
              setIsOpen(false);
              e.stopPropagation();
            }}
          >
            <span>確認</span>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
