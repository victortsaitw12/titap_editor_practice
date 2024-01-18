import Link from "@tiptap/extension-link";
import { mergeAttributes } from "@tiptap/core";

export const CustomLink = Link.extend({
  parseHTML() {
    return [{ tag: "a" }, { tag: "span" }];
  },
  renderHTML: ({ HTMLAttributes }) => {
    return [
      "a",
      mergeAttributes(HTMLAttributes, {
        class: "",
        // rel: null,
        target: "_self",
        href: null,
      }),
      0,
    ];
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      onclick: {
        default: null,
      },
    };
  },
});
