"use client";
import React, { useCallback, useState,useEffect } from 'react'
import { type Editor, BubbleMenu } from "@tiptap/react"
import {
    Bold,
    Strikethrough,
    Italic,
    Underline,
    Code,
    Superscript,
    Subscript,
    Link,
    Trash2,
    GalleryVertical,
    Fullscreen,
    Pencil,
    Tv2
} from "lucide-react";
import { Toggle } from "./ui/toggle"

type Props = {
    editor: Editor | null,
    isImageActive: boolean
}
function BubbleMenuList({ editor, isImageActive }: Props) {
    const [imageFullScreen, setImageFullScreen] = useState(false);
    const [imageClassName, setImageClassName] = useState<string | undefined>();

    const setLink = useCallback(() => {
        if ( editor && editor.isActive("link")) {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()
            return
        }
        const previousUrl = editor && editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor && editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()
            return
        }

        // update link
        editor && editor.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [editor])

    useEffect(() => {
        console.log(`imageFullScreen is:${imageFullScreen}`)
        
    },[imageFullScreen])

    if (!editor) {
        return null;
    }

    const handleFullScreen = () => {
        setImageFullScreen(true)
        
    }

    return (
        <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
            {!isImageActive && (<><Toggle
                className='bubble-menu-item'
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                }>
                <Bold className='h-4 w-4' />
            </Toggle>
                <Toggle
                    className='bubble-menu-item'
                    size="sm"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleItalic().run()
                    }>
                    <Italic className='h-4 w-4' />
                </Toggle>
                <Toggle
                    className='bubble-menu-item'
                    size="sm"
                    pressed={editor.isActive("strike")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleStrike().run()
                    }>
                    <Strikethrough className='h-4 w-4' />
                </Toggle>
                <Toggle
                    className='bubble-menu-item'
                    size="sm"
                    pressed={editor.isActive("underline")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleUnderline().run()
                    }>
                    <Underline className='h-4 w-4' />
                </Toggle>
                <Toggle
                    className='bubble-menu-item'
                    size="sm"
                    pressed={editor.isActive("code")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleCode().run()
                    }>
                    <Code className='h-4 w-4' />
                </Toggle>
                <Toggle
                    className='bubble-menu-item'
                    size="sm"
                    pressed={editor.isActive("superscript")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleSuperscript().run()
                    }>
                    <Superscript className='h-4 w-4' />
                </Toggle>
                <Toggle
                    className='bubble-menu-item'
                    size="sm"
                    pressed={editor.isActive("subscript")}
                    onPressedChange={() =>
                        editor.chain().focus().toggleSubscript().run()
                    }>
                    <Subscript className='h-4 w-4' />
                </Toggle>
                <Toggle
                    className='bubble-menu-item left-seprator'
                    size="sm"
                    pressed={editor.isActive("link")}
                    onPressedChange={setLink}>
                    <Link className='h-4 w-4' />
                </Toggle></>)}
            {isImageActive && (
                <>
                    <Toggle
                        className='bubble-menu-item'
                        size="sm"
                        pressed={editor.isActive("image")}
                        onPressedChange={() =>
                            setImageFullScreen(false)
                        }>
                        <GalleryVertical></GalleryVertical>
                    </Toggle>
                    <Toggle
                        className={`bubble-menu-item`}
                        size="sm"
                        pressed={editor.isActive("image")}
                        onPressedChange={handleFullScreen}>
                        <Tv2></Tv2>
                    </Toggle>
                    <Toggle
                        className='bubble-menu-item left-seprator'
                        size="sm"
                        pressed={editor.isActive("image")}
                        onPressedChange={() =>
                            console.log("image is active1")
                        }>
                        <Pencil></Pencil>
                    </Toggle>
                    <Toggle
                        className='bubble-menu-item'
                        size="sm"
                        pressed={editor.isActive("image")}
                        onPressedChange={() =>
                            editor.chain().focus().setImage({ src: '' }).run()
                        }>
                        <Trash2></Trash2>
                    </Toggle>
                </>
                // 顯示圖片相關的選項

            )}
        </BubbleMenu>
    )
}

export default BubbleMenuList