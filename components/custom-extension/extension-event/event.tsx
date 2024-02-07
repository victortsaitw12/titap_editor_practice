import { Extension } from "@tiptap/core";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";
import { Plugin, PluginKey } from "prosemirror-state";
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
            mouseover(view, event) {
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
                    console.log(posInDoc);
                    console.log(resolvePosition);
                    console.log(tr);
                    const start =
                      resolvePosition.parentOffset === 0
                        ? posInDoc.pos
                        : posInDoc.pos - resolvePosition.parentOffset;
                    const end =
                      resolvePosition.parentOffset === 0
                        ? posInDoc.pos + 1
                        : posInDoc.pos;
                    const $start = doc.resolve(start);
                    const $end = doc.resolve(end);
                    const transaction = tr.setSelection(
                      new TextSelection($start, $end)
                    );
                    view.dispatch(transaction);
                    event.stopPropagation();
                    console.log("==============================");
                  }
                }
              }
            },
          },
          // handleClick(view, pos, event) {
          //   // 確保 event 是 MouseEvent
          //   if (event instanceof MouseEvent) {
          //     const { schema, doc, tr } = view.state;
          //     console.log(tr);
          //     const attrs = getMarkAttrs(view.state, schema.marks.link);
          //     const range = getMarkRange(doc.resolve(pos), schema.marks.link);
          //     if (!range) {
          //       // image prosemirror plugin
          //       // 獲取點擊位置的 ProseMirror 位置
          //       const posInDoc = view.posAtCoords({
          //         left: event.clientX,
          //         top: event.clientY,
          //       });
          //       // console.log(view.state);
          //       if (posInDoc) {
          //         const resolvePosition = doc.resolve(posInDoc.pos);
          //         const selectType = resolvePosition.parent.type.name;
          //         if (selectType === "figure") {
          //           const start =
          //             resolvePosition.parentOffset === 0
          //               ? posInDoc.pos
          //               : posInDoc.pos - resolvePosition.parentOffset;
          //           const caption = resolvePosition.nodeAfter?.text?.length;
          //           const end =
          //             resolvePosition.parentOffset === 0
          //               ? posInDoc.pos + (caption ? caption : 0)
          //               : posInDoc.pos;
          //           const $start = doc.resolve(start);
          //           const $end = doc.resolve(end);
          //           const transaction = tr.setSelection(
          //             new TextSelection($start, $end)
          //           );
          //           view.dispatch(transaction);
          //           event.stopPropagation();
          //         }
          //       }
          //       return;
          //     }
          //     // link prosemirror plugin
          //     if (attrs.href) {
          //       const $start = doc.resolve(range.from);
          //       const $end = doc.resolve(range.to);
          //       const transaction = tr.setSelection(
          //         new TextSelection($start, $end)
          //       );
          //       view.dispatch(transaction);
          //       event.stopPropagation();
          //     }
          //   }
          //   // if (event instanceof MouseEvent) {
          //   //   const posInDoc = view.posAtCoords({
          //   //     left: event.clientX,
          //   //     top: event.clientY,
          //   //   });
          //   //   const { schema, doc, tr } = view.state;
          //   //   if (posInDoc) {
          //   //     const resolvePosition = doc.resolve(posInDoc.pos);

          //   //     const hoverType = resolvePosition.parent.firstChild?.type.name;

          //   //     if (
          //   //       hoverType === "youtube" ||
          //   //       (hoverType === "paragraph" &&
          //   //         (resolvePosition.nodeAfter?.type.name === "youtube" ||
          //   //           resolvePosition.nodeBefore?.type.name === "youtube"))
          //   //     ) {
          //   //       console.log("click youtube");
          //   //       console.log(posInDoc);
          //   //       console.log(resolvePosition);
          //   //       console.log(tr);
          //   //       console.log("==============================");
          //   //       const parentOffset = resolvePosition.parentOffset;

          //   //       const pos = resolvePosition.pos;
          //   //       const selection =
          //   //         parentOffset === 0 ? pos : pos - parentOffset;
          //   //       const transaction = tr.setSelection(
          //   //         new NodeSelection(doc.resolve(selection))
          //   //       );
          //   //       view.dispatch(transaction);
          //   //     }
          //   //   }
          //   // }
          // },
        },
      }),
    ];
  },
});
