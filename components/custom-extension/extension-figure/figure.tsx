"use client";
import LinkContext, { LinkProps } from "@/context/linkContext";
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
        parseHTML: (element) => {
          const ele = element as HTMLElement;
          const caption = ele.lastChild?.firstChild?.textContent;
          return (
            element.querySelector("img")?.getAttribute("caption") || caption
          );
        },
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
        tag: "figure[data-figure] img figcaption",
        contentElement: "a",
      },
      {
        tag: "div",
        content: "img small span",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const dataCaption = HTMLAttributes.caption;
    const captionLink = HTMLAttributes.captionLink;
    console.log(`dataCaption:${dataCaption}, captionLink:${captionLink}`);
    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-figure": "",
        draggable: true,
        class: `${HTMLAttributes.class ? HTMLAttributes.class : ""}`,
      }),
      [
        "img",
        {
          src: HTMLAttributes.src,
          alt: HTMLAttributes.alt,
          title: HTMLAttributes.title,
          draggable: false,
          contenteditable: false,
          class: "figure w-full",
        },
      ],
      [
        "figcaption",
        {
          contenteditable: "false",
          class: `${dataCaption ? "text-sm" : ""}`,
        },
        [
          "a",
          {
            contenteditable: "false",
            class: `${dataCaption ? "text-sm" : ""} ${
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
          // console.log(`caption:${caption},link:${link}`);
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
                const startPos = selection.to - selection.$anchor.parentOffset;
                const endPos = selection.to;
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
          handleClick(view, pos, event) {
            // 確保 event 是 MouseEvent
            if (event instanceof MouseEvent) {
              // 獲取點擊位置的 ProseMirror 位置
              const posInDoc = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              const { schema, doc, tr } = view.state;
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
              }
            }
          },
        },
      }),
    ];
  },
});
