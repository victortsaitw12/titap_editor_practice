// ImageUploadDialog.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogOverlay, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from './ui/dialog';
import { Table, TableBody, TableRow, TableCell } from './ui/table';
import { Image, Info, Pencil, Link, ArrowDownUp, Trash, CheckCircle2 } from 'lucide-react';
import { type Editor } from "@tiptap/react"

type Props = {
    editor: Editor | null
}

const ImageUploadDialog = ({ editor }: Props) => {
    const [imageLinkDisabled, setImageLinkDisabled] = useState(true);
    const [selectedImages, setSelectedImages] = useState<{ file: string; alt: string; }[]>([]);

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
    }
    const addImageToDialog = (url: string, altText: string) => {
        setSelectedImages((prevImages) => [
            ...prevImages,
            {
                file: url,
                alt: altText
            }
        ]);
    }
    const addImageToEditor = (images: { file: string; alt: string; }[]) => {
        if (editor && images) {
            images.map((item) => {
                editor.chain().focus().setImage({ src: item.file, alt: item.alt }).run()
            })
        }
    }
    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadFiles = e.target.files;
        if (uploadFiles) {
            for (let i = 0; i < uploadFiles.length; i++) {
                const currentFile = uploadFiles[i];
                upload(currentFile)
                    .then((res) => addImageToDialog(res, currentFile.name))
                    .catch((err) => console.error(err))
            }
        }
        return;
    }
    const handleImageLink = (e: React.ChangeEvent<HTMLInputElement>) => {
        const imageDescription = e.target.value
        imageDescription.length > 0 ? setImageLinkDisabled(false) : setImageLinkDisabled(true)
    }
    const handleTrashClick = (index: number) => {
        setSelectedImages((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
    }

    return (
        <Dialog>
            <DialogTrigger className='p-[10px]'>
                <Image aria-label='image' className='w-4 h-4' />
            </DialogTrigger>

            <DialogContent className='dialogContent overflow-y-scroll w-[800px] h-[540px]'>
                <DialogHeader className=''>
                    <DialogTitle>
                        <span>上傳圖片</span>
                    </DialogTitle>
                    <hr className='w-[106%] translate-x-[-3%]'></hr>
                </DialogHeader>
                <div className='uploadImageArea w-[100%] h-[290px] border-dashed border-2 rounded-lg mt-5 mb-3 relative'>
                    <div className='absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] flex flex-col items-center'>
                        <Image aria-label='image' className='w-14 h-14 text-neutral-400' />
                        <span className='text-neutral-400 text-base'>請點擊選取檔案，或是拖曳多張圖片於此進行上傳</span>
                        <label className='mt-4 border px-3 py-2 border-black text-black cursor-pointer rounded-md hover:bg-neutral-100'>
                            選取檔案
                            <input
                                className='hidden'
                                type='file'
                                onChange={handleAddImage}
                                accept='image/jpeg, image/png, image/gif'
                                multiple
                            />
                        </label>
                    </div>
                </div>
                <div className='flex items-center text-neutral-400 mb-3'>
                    <Info className='w-5 h-5'></Info>
                    <span className='ms-1'>圖片最多為 10 張，格式僅接受 jpg, png, gif。</span>
                </div>
                {selectedImages && <hr></hr>}
                <div>
                    <Table>
                        <TableBody>
                            {selectedImages.map((image, index) => (
                                <TableRow key={index}>
                                    {image && (
                                        <>
                                            <TableCell className='ps-[5px] pe-[10px] text-lg'>
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className='px-0'>
                                                <div className='border rounded-md p-2 border-neutral-400'>
                                                    <ArrowDownUp className='w-4 h-4'></ArrowDownUp>
                                                </div>
                                            </TableCell>
                                            <TableCell className='ps-[10px] pe-[10px] w-[35%]'>
                                                <div className='flex items-center border rounded-xl px-3 py-2'>
                                                    <Pencil className='w-4 h-4'></Pencil>
                                                    <input
                                                        placeholder='請輸入圖片敘述'
                                                        className='border-0 focus:border-0 ms-2 w-[75%] outline-none'
                                                        onChange={(e) => handleImageLink(e)}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className={`ps-[1px] pe-[10px] w-[35%] ${imageLinkDisabled ? 'opacity-70' : ''}`}>
                                                <div className={`flex items-center border rounded-xl px-3 py-2 ${imageLinkDisabled ? 'bg-neutral-300' : ''}`}>
                                                    <Link className='w-4 h-4'></Link>
                                                    <input
                                                        placeholder='請輸入連結，例：https://...'
                                                        className={`border-0 focus:border-0 ms-2 w-[75%] ${imageLinkDisabled ? 'cursor-not-allowed ' : ''} outline-none`}
                                                        disabled={imageLinkDisabled}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className='ps-0 pe-[10px]'>
                                                <CheckCircle2 color='green'></CheckCircle2>
                                            </TableCell>
                                            <TableCell className='px-0'>
                                                <img src={image.file} alt={image.alt} className="" />
                                            </TableCell>
                                            <TableCell className='pe-0 ps-[10px]'>
                                                <div className='border rounded-md p-2 border-neutral-400'>
                                                    <Trash className='cursor-pointer' onClick={() => handleTrashClick(index)}></Trash>
                                                </div>
                                            </TableCell></>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <hr className='w-[106%] translate-x-[-3%]'></hr>
                <div className='flex justify-center items-center'>
                    <DialogClose className='rounded-xl text-black bg-white px-5 py-3 hover:bg-neutral-100 disabled:cursor-not-allowed'>
                        <span onClick={() => setSelectedImages([])}>取消</span>
                    </DialogClose>
                    <DialogClose className='rounded-xl bg-white ms-3 px-5 py-3 enabled:hover:bg-black enabled:bg-neutral-700 enabled:text-white disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400' disabled={selectedImages.length > 0 ? false : true}
                    >
                        <span onClick={() => {
                            addImageToEditor(selectedImages)
                            setSelectedImages([])
                        }}>
                            確認
                        </span>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImageUploadDialog;
