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
});
