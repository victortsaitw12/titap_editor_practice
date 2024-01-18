import { mergeAttributes, Node } from "@tiptap/core";

export interface InstagramOptions {
  HTMLAttributes: Record<string, any>;
  width: number;
  height: number;
  controls: boolean;
  inline: boolean;
  allowtransparency: string;
  frameborder: string;
  scrolling: string;
}

type SetInstagramPostOptions = {
  src: string;
  width?: number;
  height?: number;
  scrolling?: string;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    instagram: {
      /**
       * Insert a instagram post
       */
      setInstagramPost: (options: SetInstagramPostOptions) => ReturnType;
    };
  }
}
export const INSTAGRAM_REGEX =
  /^(https?:\/\/)?(www\.)?instagram\.com\/(?:p|reels)\/[a-zA-Z0-9_\-]+\/?/;

export const isValidInstagramUrl = (url: string) => {
  return url.match(INSTAGRAM_REGEX);
};

export const Instagram = Node.create<InstagramOptions>({
  name: "instagram",

  addOptions() {
    return {
      HTMLAttributes: {},
      width: 500,
      height: 600,
      controls: true,
      inline: false,
      allowtransparency: "true",
      frameborder: "0",
      scrolling: "auto",
    };
  },

  inline() {
    return this.options.inline;
  },

  group() {
    return this.options.inline ? "inline" : "block";
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: this.options.width,
      },
      height: {
        default: this.options.height,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-instagram-post] iframe",
      },
    ];
  },

  addCommands() {
    return {
      setInstagramPost:
        (options: SetInstagramPostOptions) =>
        ({ commands }) => {
          if (!isValidInstagramUrl(options.src)) {
            return false;
          }

          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const embedUrl = HTMLAttributes.src + "embed/";

    HTMLAttributes.src = embedUrl;

    return [
      "div",
      { "data-instagram-post": "" },
      [
        "iframe",
        mergeAttributes(
          this.options.HTMLAttributes,
          {
            width: this.options.width,
            height: this.options.height,
          },
          HTMLAttributes
        ),
      ],
    ];
  },
});
