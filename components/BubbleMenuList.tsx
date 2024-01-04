"use client";
import React, { useCallback } from 'react'
import { type Editor, BubbleMenu } from "@tiptap/react"
import {
    Bold,
    Strikethrough,
    Italic,
    Underline,
    Code,
    Superscript,
    Subscript,
    Link
} from "lucide-react";

import { Toggle } from "./ui/toggle"

type Props = {
    editor: Editor | null
}
function BubbleMenuList({ editor }: Props) {
  if (!editor) {
    return null;
  }
    
  const setLink = useCallback(() => {
    if(editor.isActive("link")) {
        editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()
        return
    }
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
        return
    }

    // empty
    if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()
        return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
        .run()
  }, [editor])


  return (
    <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
        <Toggle
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
        </Toggle>
    </BubbleMenu>  
    )
}

export default BubbleMenuList