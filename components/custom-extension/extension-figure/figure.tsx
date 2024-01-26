import {
  findChildrenInRange,
  mergeAttributes,
  Node,
  nodeInputRule,
  Tracker,
} from "@tiptap/core";

import {
  NodeSelection,
  Plugin,
  PluginKey,
  TextSelection,
} from "@tiptap/pm/state";
import { resolve } from "path";
export interface FigureOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      /**
       * Add a figure element
       */
      setFigure: (options: {
        src: string;
        alt?: string;
        title?: string;
        caption?: string;
        link?: string;
      }) => ReturnType;
      setFigureClass: (options: { customClass: string }) => ReturnType;
    };
  }
}

export const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export const Figure = Node.create<FigureOptions>({
  name: "figure",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  inline: false,

  group: "block",

  content: "inline*",

  draggable: true,

  selectable: true,

  isolating: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("src"),
      },

      alt: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("alt"),
      },

      title: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("title"),
      },

      class: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("class"),
      },

      caption: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("caption"),
      },

      captionLink: {
        default: null,
        parseHTML: (element) =>
          element.querySelector("img")?.getAttribute("captionLink"),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure [data-figure] figcaption",
        contentElement: "a",
      },
      // {
      //   tag: "",
      //   contentElement: "a",
      // },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const dataCaption = HTMLAttributes.caption;
    const captionLink = HTMLAttributes.captionLink;
    console.log(`caption:${dataCaption},link:${captionLink}`);
    console.log(HTMLAttributes);
    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-figure": "",
        draggable: true,
        class: `${HTMLAttributes.class ? HTMLAttributes.class : ""}`,
      }),
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          draggable: false,
          contenteditable: false,
          class: "figure",
        }),
      ],
      [
        "figcaption",
        {
          contenteditable: "false",
          class: `${dataCaption ? "" : "hidden"}`,
        },
        [
          "a",
          {
            contenteditable: "false",
            class: `${dataCaption ? "" : "hidden"} ${
              captionLink ? "" : "pointer-events-none"
            } caption`,
            style: `${captionLink ? "" : "color:black"}`,
            href: `${captionLink ? captionLink : null}`,
            target: "_blank",
          },
          0,
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setFigure:
        ({ caption, link, ...attrs }) =>
        ({ chain }) => {
          return (
            chain()
              .insertContent({
                type: this.name,
                attrs: { ...attrs, captionLink: link, caption: caption },
                content: caption ? [{ type: "text", text: caption }] : [],
              })
              // set cursor at end of caption field
              .command(({ tr, commands }) => {
                const { doc, selection } = tr;
                console.log(selection.$anchor.parentOffset);
                const position = doc
                  .resolve(selection.to - selection.$anchor.parentOffset)
                  .end();
                const startPos = selection.to - selection.$anchor.parentOffset;
                const endPos = selection.to;
                console.log(`startPos:${startPos},endPos:${endPos}`);
                // console.log(doc);
                console.log(selection);
                // console.log(position);
                if (selection.$anchor.parentOffset === 0) {
                  console.log("just image");
                  commands.selectParentNode();
                  console.log("just image1");

                  return commands.setTextSelection(startPos);
                }
                return commands.setTextSelection({
                  from: startPos,
                  to: endPos,
                });
              })
              .run()
          );
        },
      setFigureClass:
        ({ customClass }) =>
        ({ commands }) => {
          console.log("in here");
          return commands.updateAttributes("figure", { class: customClass });
        },
    };
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, src, alt, title, captionLink] = match;

          return { src, alt, title, captionLink };
        },
      }),
    ];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("eventHandler"),
        props: {
          // handleClick(view, pos, event) {
          //   const { schema, doc, tr } = view.state;
          //   console.log("+++++++++++++++++++++");
          //   // console.log(schema);
          //   console.log(pos);
          //   console.log(view.state);
          //   const attrs = getNodeAttrs(view.state, schema.nodes.figure);
          //   const range = getNodeRange(doc.resolve(pos), schema.nodes.figure);
          //   console.log(attrs);
          //   console.log(range);
          //   // console.log(doc);
          //   // console.log(tr);
          //   // console.log(schema.nodes.figure);
          //   // console.log(tr.selection);
          //   // console.log(doc.resolve(pos));
          //   console.log("Click a Figure");
          // },
          handleClickOn: (view, pos, node) => {
            const { schema, doc, tr } = view.state;
            console.log("handleClickOn", node.attrs);
            console.log(pos);
            console.log(view.state);
            const attrs = node.attrs;
            console.log(attrs);
            if (attrs.captionLink) {
              console.log("Click a captionLink Figure");
            } else if (attrs.caption) {
              console.log("Click a caption Figure");
            } else if (attrs.src) {
              console.log("Click a Figure");
              const start = doc.resolve(pos + 1);
              // console.log(start);
              const end = doc.resolve(pos - 1);
              // console.log(end);
              const transaction = tr.setSelection(
                new TextSelection(start, end)
              );
              view.dispatch(transaction);
            }
            const test = view.state.doc.content;
            console.log(`check value:${test},${typeof test}`);
            // view.dispatch(pos)
          },
        },
      }),
    ];
  },
});
