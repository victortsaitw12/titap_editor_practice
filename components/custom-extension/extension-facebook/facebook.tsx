import { mergeAttributes, Node } from "@tiptap/core";

export interface FacebookOptions {
  HTMLAttributes: Record<string, any>;
  width: string;
  height: string;
  inline: boolean;
  frameborder: string;
  scrolling: string;
}

type SetFacebookOptions = {
  src: string;
  width?: string;
  height?: string;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    facebook: {
      /**
       * Insert a facebook post or video
       */
      setFacebook: (options: SetFacebookOptions) => ReturnType;
    };
  }
}
export const FACEBOOK_VIDEO_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.me|fb\.watch)\/(?:video\.php\?v=|.*\/videos\/|.*\/v\/)?(\d+)(?:\/|\?|\&\S*)?$/;
export const FACEBOOK_POST_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com)\/(?:.*\/posts\/)([a-zA-Z0-9]+)(?:\/|\?|\&\S*)?$/;
export const isValidFacebookVideoUrl = (url: string) => {
  return url.match(FACEBOOK_VIDEO_REGEX);
};
export const isValidFacebookPostUrl = (url: string) => {
  return url.match(FACEBOOK_POST_REGEX);
};
export const Facebook = Node.create<FacebookOptions>({
  name: "facebook",

  addOptions() {
    return {
      HTMLAttributes: {},
      width: "550",
      height: "510",
      inline: false,
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
        tag: "div[data-facebook] iframe",
      },
    ];
  },

  addCommands() {
    return {
      setFacebook:
        (options: SetFacebookOptions) =>
        ({ commands }) => {
          if (
            !isValidFacebookVideoUrl(options.src) &&
            !isValidFacebookPostUrl(options.src)
          ) {
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
    const url = encodeURIComponent(HTMLAttributes.src);
    let embedUrl = "";
    let embedType = "";
    if (isValidFacebookPostUrl(url)) {
      embedUrl =
        "https://www.facebook.com/plugins/video.php?height=420&href=" +
        url +
        "&show_text=true";
    } else {
      embedUrl =
        "https://www.facebook.com/plugins/post.php?href=" +
        url +
        "&show_text=true";
    }

    HTMLAttributes.src = embedUrl;

    return [
      "div",
      {
        "data-facebook": "",
        class: "flex items-center justify-center",
      },
      [
        "iframe",
        mergeAttributes(
          this.options.HTMLAttributes,
          {
            width: this.options.width,
            height: this.options.height,
            frameborder: this.options.frameborder,
          },
          HTMLAttributes
        ),
      ],
    ];
  },
});
