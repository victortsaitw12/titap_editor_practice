// ImageUploadDialog.tsx
import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
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
  AlertCircle,
} from "lucide-react";
import { type Editor } from "@tiptap/react";
import MediaContentContext, {
  MediaContentProps,
} from "@/context/mediaContentContext";
import {
  setNode,
  upload,
} from "./custom-extension/extension-figure/utils/function";
import EditorContentContext, {
  EditorContentProps,
} from "@/context/editorContext";
import CustomTooltip from "./tooltipContent";

type Props = {
  editor: Editor | null;
  delayDuration: number;
};

const ImageUploadDialog = ({ editor, delayDuration }: Props) => {
  const [imageLinkDisabled, setImageLinkDisabled] = useState<
    { disabled: boolean }[]
  >([{ disabled: true }]);
  const [selectedImages, setSelectedImages] = useState<
    {
      file: string;
      name: string;
      alt?: string;
      oversize: boolean;
      loading: boolean;
      size: number;
      blob: Blob;
    }[]
  >([]);
  const [imagesDescription, setImagesDescription] = useState<
    { caption: string; link: string }[]
  >([]);
  const { setIsOpen } = useContext<MediaContentProps | any>(
    MediaContentContext
  );
  const { setEditorImages } = useContext<EditorContentProps | any>(
    EditorContentContext
  );

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    if (uploadFiles) {
      for (let i = 0; i < uploadFiles.length; i++) {
        const currentFile = uploadFiles[i];
        const imageUrl = URL.createObjectURL(currentFile);
        const imageuuid = imageUrl.slice(-36);

        // FileReader
        // upload(currentFile)
        //   .then((res) =>
        //     addImageToDialog(res, currentFile.name, currentFile.size)
        //   )
        //   .catch((err) => console.error(err));
        // console.log(currentFile);
        const imageType = currentFile.name.split(".")[1];
        const imageName = imageuuid + "." + imageType;

        // blob
        if (currentFile) {
          const reader = new FileReader();
          reader.onload = function () {
            if (reader.result) {
              const blob = new Blob([reader.result], {
                type: currentFile.type,
              });
              const imageBlob = blob;
              addImageToDialog(
                imageUrl,
                imageName,
                currentFile.size,
                imageBlob
              );
            }
          };
          reader.readAsArrayBuffer(currentFile);
        }
      }
    }
    return;
  };

  const addImageToDialog = (
    url: string,
    fileName: string,
    size: number,
    blob: Blob
  ) => {
    // console.log("addImageToDialog");
    const maxSizeInBytes = 200 * 1024; // 200KB
    setSelectedImages((prevImages) => {
      return [
        ...prevImages,
        {
          file: url,
          name: fileName,
          alt: "",
          oversize: size > maxSizeInBytes,
          loading: true,
          size,
          blob,
        },
      ];
    });
    setImageLinkDisabled((prevImages) => [
      ...prevImages,
      {
        disabled: true,
      },
    ]);
  };

  const handleImageCaption = (
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
    const updatedSelectedImages = [...selectedImages];
    updatedSelectedImages[index] = {
      ...updatedSelectedImages[index],
      alt: imageDescription,
    };
    setSelectedImages(updatedSelectedImages);

    // 改 link disabled狀態
    const updatedImageLinkDisabled = [...imageLinkDisabled];
    updatedImageLinkDisabled[index] = {
      disabled: imageDescription.length > 0 ? false : true,
    };
    setImageLinkDisabled(updatedImageLinkDisabled);
  };
  const handleImageLink = (
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

  // 拖曳列元素
  const [tmpImages, setTmpImages] = useState<
    {
      file: string;
      name: string;
      alt?: string;
      oversize: boolean;
      loading: boolean;
      size: number;
      blob: Blob;
    }[]
  >([]);
  const handleDragStart = (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.dataTransfer.setData("text/plain", String(index));
  };
  const handleDragOver = (
    index: number,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const draggedOverIndex = index;
    const draggedIndex = Number(e.dataTransfer.getData("text/plain"));

    if (draggedIndex !== draggedOverIndex) {
      // 更新 selectedImages 的順序
      const reorderedImages = [...selectedImages];
      const [draggedImage] = reorderedImages.splice(draggedIndex, 1);
      reorderedImages.splice(draggedOverIndex, 0, draggedImage);
      setTmpImages(reorderedImages);
    }
  };
  const handleDragEnd = () => {
    setSelectedImages(tmpImages);
  };

  // 新增至編輯器
  const addImageToEditor = (
    images: {
      file: string;
      name: string;
      alt?: string;
      size: number;
      blob: Blob;
    }[],
    imagesDescription: { caption: string; link: string }[]
  ) => {
    if (editor && images) {
      images.map((item, index) => {
        if (imagesDescription[index]) {
          setNode(
            editor,
            "figure",
            item.file,
            item.name,
            imagesDescription[index]?.caption,
            imagesDescription[index]?.link
          );
        } else {
          setNode(editor, "image", item.file, item.name);
        }
        setEditorImages((prevImages: any) => [
          ...prevImages,
          {
            file: item.file,
            name: item.name,
            alt: item?.alt,
            size: item.size,
            blob: item.blob,
          },
        ]);
      });
      setSelectedImages([]);
      setImagesDescription([]);
      setImageLinkDisabled([{ disabled: true }]);
    }
  };
  useEffect(() => {
    selectedImages.map((item, index) => {
      if (item.loading) {
        setTimeout(() => {
          const updatedImages = [...selectedImages];
          updatedImages[index] = { ...item, loading: false };
          setSelectedImages(updatedImages);
        }, 3000);
      }
    });
  }, [selectedImages]);

  return (
    <Dialog>
      <CustomTooltip
        delayDuration={delayDuration}
        content="上傳圖片"
        side="bottom"
      >
        <DialogTrigger className="p-[10px]">
          <Image aria-label="image" className="w-4 h-4" />
        </DialogTrigger>
      </CustomTooltip>

      <DialogContent className="w-[800px] mt-2">
        <DialogHeader className="">
          <DialogTitle>
            <span>上傳圖片</span>
          </DialogTitle>
          <hr className="w-[106%] translate-x-[-3%]"></hr>
        </DialogHeader>
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          <div
            className={`uploadImageArea w-[100%] ${
              selectedImages.length > 0
                ? "min-h-[175px] mt-3"
                : "min-h-[290px] mt-5"
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
          <div className={"overflow-x-hidden"}>
            <Table>
              <TableBody>
                {selectedImages.map((image, index) => (
                  <TableRow key={index}>
                    {image && (
                      <>
                        <TableCell className="ps-[5px] pe-[10px] text-lg">
                          {index + 1}
                        </TableCell>
                        <TableCell
                          className={`px-0 hover:cursor-pointer ${
                            image.loading && "opacity-50 cursor-not-allowed"
                          }`}
                          draggable
                          onDragStart={(e) => handleDragStart(index, e)}
                          onDragOver={(e) => handleDragOver(index, e)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="border rounded-md p-2 border-neutral-400">
                            <ArrowDownUp
                              className="w-4 h-4"
                              aria-label="drag"
                            ></ArrowDownUp>
                          </div>
                        </TableCell>
                        <TableCell className="ps-[10px] pe-[10px] w-[35%]">
                          <div className="flex items-center border rounded-xl px-3 py-2">
                            <Pencil className="w-4 h-4"></Pencil>
                            <input
                              placeholder="請輸入圖片敘述"
                              className="border-0 focus:border-0 ms-2 w-[75%] outline-none"
                              onChange={(e) => handleImageCaption(e, index)}
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
                              onChange={(e) => handleImageLink(e, index)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="ps-0 pe-[10px]">
                          {image.loading ? (
                            "上傳中"
                          ) : image.oversize ? (
                            <AlertCircle color="#ff9500"></AlertCircle>
                          ) : (
                            <CheckCircle2 color="green"></CheckCircle2>
                          )}
                        </TableCell>
                        <TableCell className="px-0">
                          {image.loading ? (
                            <div className="flex justify-center">
                              <svg
                                aria-hidden="true"
                                className="h-5 w-5 animate-spin fill-white px-auto"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                  fill="currentColor"
                                />
                                <path
                                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                  fill="currentFill"
                                />
                              </svg>
                            </div>
                          ) : (
                            <img
                              src={image.file}
                              alt={image.name}
                              className=""
                            />
                          )}
                        </TableCell>
                        <TableCell className="pe-0 ps-[10px]">
                          <div
                            className={`border rounded-md p-2 border-neutral-400 max-w-[42px] ${
                              image.loading && "opacity-50 pointer-events-none"
                            }`}
                          >
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
          {selectedImages.filter((item) => item.oversize === true).length > 0 &&
            selectedImages.filter((item) => item.loading === false).length >
              0 && (
              <div className="flex items-center">
                <AlertCircle color="#ff9500" size={20}></AlertCircle>
                <span className="ms-1 text-neutral-500">該圖檔大於200KB</span>
              </div>
            )}
        </div>
        <hr className="w-[106%] translate-x-[-3%]"></hr>
        <div className="flex justify-center items-center">
          <DialogClose
            className="rounded-xl text-black bg-white px-5 py-3 hover:bg-neutral-100 disabled:cursor-not-allowed"
            onClick={(e) => {
              setSelectedImages([]);
              setIsOpen(false);
              e.stopPropagation();
            }}
          >
            <span>取消</span>
          </DialogClose>
          <DialogClose
            className="rounded-xl bg-white ms-3 px-5 py-3 enabled:hover:bg-black enabled:bg-neutral-700 enabled:text-white disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
            disabled={
              selectedImages.length === 0 ||
              selectedImages.length > 10 ||
              selectedImages.filter((item) => item.loading === true).length > 0
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
