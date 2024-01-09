"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { type Editor } from "@tiptap/react"
import {
    List,
    ListOrdered,
    Heading2,
    AlignCenter,
    Quote,
    Code2,
    Undo,
    Redo,
    Image,
    Plus,
    Link,
    GalleryHorizontal,
    FileSearch,
    SeparatorHorizontal
} from "lucide-react";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Toggle } from "./ui/toggle"
import ImageUploadDialog from "./ImageUploadDialog"
import ImageSearchDialog from './ImageSearchDialog';

type Props = {
    editor: Editor | null
}
function Toolbar({ editor }: Props) {
    const [align, setAlign] = useState("left");


    const setLink = useCallback(() => {
        if (!editor) {
            return;
        }

        const isActiveLink = editor.isActive("link");
        const previousUrl = editor.getAttributes('link')?.href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();

    }, [editor])
    const handleDividerClick = useCallback(() => {
        editor?.chain().focus().setHorizontalRule().run();
    
        // 模擬按下 Enter 鍵
        const event = new KeyboardEvent('keydown', {
          key: 'Enter',
        });
        document.dispatchEvent(event);
      }, [editor]);

    const toggleRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event:any) => {
            if (toggleRef.current && !toggleRef.current.contains(event.target)) {
                // 点击了 toggleRef 之外的区域，隐藏 mediaContent
                const mediaContent = document.getElementById("mediaContent");
                if (mediaContent && mediaContent.style) {
                    mediaContent.style.display = 'none';
                }
            }
        };

        // 添加点击事件监听器
        document.addEventListener('click', handleClickOutside);

        // 清除监听器
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [toggleRef]);


    if (!editor) {
        return null;
    }

    const setTextAlign = () => {
        if (align == "left") {
            setAlign("center");
        } else if (align == "center") {
            setAlign("right");
        } else {
            setAlign("left");
        }
    }
    


    return (
        // <div className='border border-input bg-transparent rounded-sm'>
        <>
            <Toggle
                ref={toggleRef}
                className='menu-item'
                size="sm"
                onClick={() => {
                    const mediaContent = document.getElementById("mediaContent");
                    if (mediaContent && mediaContent.style) {

                        mediaContent.style.display = '';
                    }
                }}>
                <Plus></Plus>
            </Toggle>

            <Toggle
                className='menu-item'
                size="sm"
                pressed={editor.isActive("heading")}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }>
                <Heading2 className='h-4 w-4' />
            </Toggle>
            <Toggle
                className='menu-item'
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBlockquote().run()
                }>
                <Quote className='h-4 w-4 text-black' />
            </Toggle>
            <Toggle
                className='menu-item'
                size="sm"
                pressed={editor.isActive("codeBlock")}
                onPressedChange={() =>
                    editor.chain().focus().toggleCodeBlock().run()
                }>
                <Code2 className='h-4 w-4 text-black' />
            </Toggle>
            <Toggle
                className='menu-item'
                size="sm"
                pressed={editor.isActive("textAlign")}
                onPressedChange={() => {
                    setTextAlign();
                    editor.chain().focus().setTextAlign(align).run();
                }}>
                <AlignCenter className='h-4 w-4' />
            </Toggle>
            <Toggle
                className='menu-item'
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                }>
                <List className='h-4 w-4' />
            </Toggle>
            <Toggle
                className='menu-item'
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }>
                <ListOrdered className='h-4 w-4' />
            </Toggle>
            <button className='left-seprator' onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo className='h-4 w-4' />
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo className='h-4 w-4' />
            </button>
            <div id='mediaContent' className='mediaContent' style={{ display: "none" }}>
                <ImageUploadDialog editor={editor}/>
                <Toggle
                    className='bubble-menu-item'
                    size="sm"
                    pressed={editor.isActive("galleryHorizontal")}
                    onPressedChange={()=>{console.log("GalleryHorizontal")}}>
                    <GalleryHorizontal className='h-4 w-4'/>
                </Toggle>
                <ImageSearchDialog editor={editor}></ImageSearchDialog>
                <Toggle
                    className='bubble-menu-item'
                    size="sm"
                    pressed={editor.isActive("link")}
                    onPressedChange={setLink}>
                    <Link className='h-4 w-4'/>
                </Toggle>
                <Toggle
                    className='bubble-menu-item'
                    size="sm"
                    pressed={editor.isActive("separatorHorizontal")}
                    onPressedChange={handleDividerClick}>
                    <SeparatorHorizontal className='h-4 w-4'/>
                </Toggle>
                
            </div>
        </>
    )
}

export default Toolbar