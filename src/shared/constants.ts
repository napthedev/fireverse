export const DEFAULT_AVATAR = "/default-avatar.png";
export const IMAGE_PROXY = (url: string) =>
  `https://agvmolqooq.cloudimg.io/v7/${url}`;

export const STICKERS_URL =
  "https://cdn.jsdelivr.net/gh/naptestdev/zalo-stickers/data/favourite.json";

export const REACTIONS_UI: {
  [key: string]: {
    icon: string;
    gif: string;
  };
} = {
  Like: {
    icon: "/reactions-icon/like.svg",
    gif: "/reactions/like.gif",
  },
  Love: {
    icon: "/reactions-icon/love.svg",
    gif: "/reactions/love.gif",
  },
  Care: {
    icon: "/reactions-icon/care.svg",
    gif: "/reactions/care.gif",
  },
  Haha: {
    icon: "/reactions-icon/haha.svg",
    gif: "/reactions/haha.gif",
  },
  Wow: {
    icon: "/reactions-icon/wow.svg",
    gif: "/reactions/wow.gif",
  },
  Sad: {
    icon: "/reactions-icon/sad.svg",
    gif: "/reactions/sad.gif",
  },
  Angry: {
    icon: "/reactions-icon/angry.svg",
    gif: "/reactions/angry.gif",
  },
};
