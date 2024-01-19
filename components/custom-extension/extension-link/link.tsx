import Link from "@tiptap/extension-link";
import { mergeAttributes } from "@tiptap/core";
import { type Editor } from "@tiptap/react";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import getMarkAttrs from "./utils/getMarkAttrs";
import getMarkRange from "./utils/getMarkRange";
type TestProps = {
  editor: Editor | null;
};
export const CustomLink = Link.extend({
  renderHTML: ({ HTMLAttributes }) => {
    return [
      "a",
      mergeAttributes(HTMLAttributes, {
        class: "custom-a",
        target: "_self",
      }),
      0,
    ];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("eventHandler"),
        props: {
          handleClick(view, pos, event) {
            const { schema, doc, tr } = view.state;
            const attrs = getMarkAttrs(view.state, schema.marks.link);
            const range = getMarkRange(doc.resolve(pos), schema.marks.link);
            if (!range) {
              return;
            }
            if (attrs.href) {
              const $start = doc.resolve(range.from);
              const $end = doc.resolve(range.to);
              const transaction = tr.setSelection(
                new TextSelection($start, $end)
              );
              view.dispatch(transaction);
              event.stopPropagation();
            }
          },
        },
      }),
    ];
  },
});
