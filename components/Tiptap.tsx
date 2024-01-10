"use client";

import { useEditor, EditorContent  } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Toolbar from "./Toolbar"
import BubbleMenuList from "./BubbleMenuList"
// import FloatingMenuList from "./FloatingMenuList"
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'

function Tiptap({description, onChange}: {
    description: string,
    onChange: (richText: string) => void
}) {
  
  const editor = useEditor({
    extensions: [
        StarterKit.configure(),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Underline.configure(),
        Superscript.configure(),
        Subscript.configure(),
        Link.configure({
            protocols: [
              {
                scheme: 'tel',
                optionalSlashes: true
              }
            ]
          }),
        Image.configure({
          allowBase64: true,
          HTMLAttributes: {
            class: 'custom-iamge',
          },
        }),
        HorizontalRule.configure({
          HTMLAttributes: {
            class: 'custom-hr',
          },
        }),
        BulletList.configure({
          HTMLAttributes: {
            class: 'list',
          },
        }),
        OrderedList.configure({
          HTMLAttributes: {
            class: 'order-list',
          },
        }),
    ],
    content: description,
    editorProps: {
        attributes: {
            class: "focus:outline-none rounded-md border-none min-h-[150px] bg-background disabled:curdor-not-allowed disabled:opacity-50",
        }
    },
    onUpdate({ editor }) {
        onChange(editor.getHTML())
    }
  })
  const isImageActive = editor ? editor.isActive("image") : false;
  return (
    <div>
        <div className="toolbar mx-auto">
            <Toolbar editor={editor} />
        </div>
        <div className="container">
            <div className="title-wrap">
                <input className="title" type="text" value={"Title"} />
            </div>
            {/* <FloatingMenuList editor={editor}/> */}
            <BubbleMenuList editor={editor} isImageActive={isImageActive}/>
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default Tiptap