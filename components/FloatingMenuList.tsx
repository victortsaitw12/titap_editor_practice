"use client";
import React from 'react'
import { type Editor, FloatingMenu } from "@tiptap/react"

type Props = {
    editor: Editor | null
}
function FloatingMenuList({ editor }: Props) {
  if (!editor) {
    return null;
  }
  return (
    <FloatingMenu className="floating-menu" tippyOptions={{ duration: 100 }} editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet List
        </button>
    </FloatingMenu>  
  )
}

export default FloatingMenuList