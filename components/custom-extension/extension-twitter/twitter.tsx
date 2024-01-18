import { mergeAttributes, Node } from "@tiptap/core";

export interface TwitterOptions {
  HTMLAttributes: Record<string, any>;
  width: string;
  height: string;
  inline: boolean;
  allowtransparency: string;
  frameborder: string;
  scrolling: string;
}

type SetTwitterPostOptions = {
  src: string;
  width?: string;
  height?: string;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    twitter: {
      /**
       * Insert a twitter post
       */
      setTwitterPost: (options: SetTwitterPostOptions) => ReturnType;
    };
  }
}
export const TWITTER_REGEX =
  /^(https?:\/\/)?(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/status\/(\d+)$/;

export const isValidTwitterUrl = (url: string) => {
  return url.match(TWITTER_REGEX);
};

export const Twitter = Node.create<TwitterOptions>({
  name: "twitter",

  addOptions() {
    return {
      HTMLAttributes: {},
      width: "550",
      height: "300",
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
        tag: "div[data-twitter-post] iframe",
      },
    ];
  },

  addCommands() {
    return {
      setTwitterPost:
        (options: SetTwitterPostOptions) =>
        ({ commands }) => {
          if (!isValidTwitterUrl(options.src)) {
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
    const embedUrl = "https://twitframe.com/show?url=" + HTMLAttributes.src;

    HTMLAttributes.src = embedUrl;

    return [
      "div",
      { "data-twitter-post": "" },
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
