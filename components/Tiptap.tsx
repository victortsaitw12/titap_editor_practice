"use client";

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Toolbar from "./Toolbar"
import BubbleMenuList from "./BubbleMenuList"
// import FloatingMenuList from "./FloatingMenuList"
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Link from '@tiptap/extension-link'

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
          })
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
  return (
    <div>
        <div className="toolbar">
            <Toolbar editor={editor} />
        </div>
        <div className="container">
            <div className="title-wrap">
                <input className="title" type="text" value={"Title"} />
            </div>
            {/* <FloatingMenuList editor={editor}/> */}
            <BubbleMenuList editor={editor}/>
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default Tiptap