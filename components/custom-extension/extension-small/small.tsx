import { mergeAttributes, Node } from "@tiptap/core";

export interface SmallOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    small: {
      /**
       * Toggle a small
       */
      setSmall: () => ReturnType;
    };
  }
}

export const Small = Node.create<SmallOptions>({
  name: "small",

  priority: 1000,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "block",

  content: "inline*",

  parseHTML() {
    return [{ tag: "small span" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["small", mergeAttributes(HTMLAttributes), ["span", {}, 0]];
  },

  addCommands() {
    return {
      setSmall:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setSmall(),
    };
  },
});
