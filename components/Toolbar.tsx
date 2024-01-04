"use client";
import React, { useState } from 'react'
import { type Editor } from "@tiptap/react"
import {
  List,
  ListOrdered,
  Heading2,
  AlignCenter,
  Quote,
  Code2,
  Undo,
  Redo
} from "lucide-react";

import { Toggle } from "./ui/toggle"
type Props = {
    editor: Editor | null
}
function Toolbar({ editor }: Props) {
  if (!editor) {
    return null;
  }
  const [align, setAlign] = useState("left");
  const setTextAlign = () => {
    if(align == "left") {
        setAlign("center");
    } else if(align == "center"){
        setAlign("right");
    } else {
        setAlign("left");
    }
  }
  return (
    // <div className='border border-input bg-transparent rounded-sm'>
    <>
        <Toggle
            className='menu-item'
            size="sm" 
            pressed={editor.isActive("heading")}
            onPressedChange={() => 
                editor.chain().focus().toggleHeading({ level: 2}).run()
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
    </>
  )
}

export default Toolbar