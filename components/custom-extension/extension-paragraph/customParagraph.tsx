import Paragraph, { ParagraphOptions } from "@tiptap/extension-paragraph";
import { mergeAttributes } from "@tiptap/react";

export const CustomParagraph = Paragraph.extend<ParagraphOptions>({
  parseHTML() {
    return [{ tag: "p span" }];
  },
  renderHTML: ({ HTMLAttributes }) => {
    return ["p", mergeAttributes(HTMLAttributes), ["span", {}, 0]];
  },
});
