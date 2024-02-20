import { Extension } from "@tiptap/core";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import getMarkAttrs from "../extension-link/utils/getMarkAttrs";
import getMarkRange from "../extension-link/utils/getMarkRange";

export const EventExtension = Extension.create({
  name: "eventHandler",

  addProseMirrorPlugins() {
    const editor = this.editor;
    const { options, view } = editor;

    const element = options.element;
    const dom = view.dom;
    return [
      new Plugin({
        key: new PluginKey("eventHandler"),
        props: {
          handleDOMEvents: {
            mouseenter(view, event) {
              if (event instanceof MouseEvent) {
                const posInDoc = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });
                const { schema, doc, tr } = view.state;
                if (posInDoc) {
                  const resolvePosition = doc.resolve(posInDoc.pos);

                  const hoverType =
                    resolvePosition.parent.firstChild?.type.name;

                  if (
                    hoverType === "youtube" ||
                    (hoverType === "paragraph" &&
                      (resolvePosition.nodeAfter?.type.name === "youtube" ||
                        resolvePosition.nodeBefore?.type.name === "youtube"))
                  ) {
                    console.log("hover youtube");
                    // console.log(posInDoc);
                    // console.log(
                    // "🚀 ~ mouseover ~ resolvePosition:",
                    // resolvePosition
                    // );
                    // console.log(event.clientX);
                    // console.log(event.clientY);
                    // console.log(view);
                    // console.log(view.dom);
                    // console.log(view.state);
                    // console.log(view.hasFocus());
                    // console.log(editor.isActive("youtube"));
                    // view.focus();
                    // const $anchor = doc.resolve(posInDoc.pos);
                    // const transaction = tr.setSelection(
                    //   new TextSelection($anchor)
                    // );
                    // view.dispatch(transaction);
                    //
                    // const newEvent = new MouseEvent("dblclick", {
                    //   clientX: event.clientX,
                    //   clientY: event.clientY,
                    //   buttons: 1,
                    // });
                    // document.dispatchEvent(newEvent);
                    view.dispatch(tr);
                    // event.stopPropagation();

                    event.stopPropagation();
                    console.log("==============================");
                  }
                }
              }
            },
          },
          handleClick(view, pos, event) {
            // 確保 event 是 MouseEvent
            if (event instanceof MouseEvent) {
              const { schema, doc, tr } = view.state;
              console.log(tr.selection.from);
              const attrs = getMarkAttrs(view.state, schema.marks.link);
              const range = getMarkRange(doc.resolve(pos), schema.marks.link);
              if (!range) {
                // image prosemirror plugin
                // 獲取點擊位置的 ProseMirror 位置
                const posInDoc = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });
                // console.log("🚀 ~ handleClick ~ event.clientX:", event.clientX);
                // console.log("🚀 ~ handleClick ~ event.clientY:", event.clientY);

                // console.log(view.state);
                if (posInDoc) {
                  const resolvePosition = doc.resolve(posInDoc.pos);

                  const selectType = resolvePosition.parent.type.name;
                  if (selectType === "figure") {
                    const start =
                      resolvePosition.parentOffset === 0
                        ? posInDoc.pos
                        : posInDoc.pos - resolvePosition.parentOffset;
                    const caption = resolvePosition.nodeAfter?.text?.length;
                    const end =
                      resolvePosition.parentOffset === 0
                        ? posInDoc.pos + (caption ? caption : 0)
                        : posInDoc.pos;
                    const $start = doc.resolve(start);
                    const $end = doc.resolve(end);
                    const transaction = tr.setSelection(
                      new TextSelection($start, $end)
                    );
                    view.dispatch(transaction);
                    event.stopPropagation();
                  }
                  // console.log(
                  //   "🚀 ~ handleClick ~ resolvePosition:",
                  //   resolvePosition
                  // );
                  // console.log(event.clientX);
                  // console.log(event.clientY);
                  if (resolvePosition.nodeBefore?.type.name === "youtube") {
                    console.log("click youtube");

                    console.log(tr);
                    console.log("+++++++++++++++++++++++++++++++++");
                  }
                }
                return;
              }
              // link prosemirror plugin
              if (attrs.href) {
                const $start = doc.resolve(range.from);
                const $end = doc.resolve(range.to);
                const transaction = tr.setSelection(
                  new TextSelection($start, $end)
                );
                view.dispatch(transaction);
                event.stopPropagation();
              }
            }
          },
        },
      }),
    ];
  },
});
