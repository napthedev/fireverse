import { FC, useState } from "react";

import ClickAwayListener from "../ClickAwayListener";
import { InView } from "react-intersection-observer";
import { STICKERS_URL } from "../../shared/constants";
import Spin from "react-cssfx-loading/src/Spin";
import SpriteRenderer from "../SpriteRenderer";
import { StickerCollections } from "../../shared/types";
import { useFetch } from "../../hooks/useFetch";

interface StickerPickerOpened {
  setIsOpened: (value: boolean) => void;
  onSelect: (value: string) => void;
}

const getRecentStickers = () => {
  const existing = localStorage.getItem("fireverse-recent-stickers") || "[]";
  try {
    const parsed = JSON.parse(existing);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (error) {
    return [];
  }
};

const StickerPicker: FC<StickerPickerOpened> = ({ setIsOpened, onSelect }) => {
  const { data, loading, error } = useFetch<StickerCollections>("sticker", () =>
    fetch(STICKERS_URL).then((res) => res.json())
  );

  const [recentStickers, setRecentStickers] = useState(getRecentStickers());

  const addRecentSticker = (url: string) => {
    const added = [...new Set([url, ...recentStickers])];

    localStorage.setItem("fireverse-recent-stickers", JSON.stringify(added));

    setRecentStickers(added);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpened(false)}>
      {(ref) => (
        <div
          ref={ref}
          className="absolute -left-16 bottom-full bg-[#222222] border-dark-lighten border-2 shadow-2xl rounded-lg w-96 h-96"
        >
          {loading || error ? (
            <div className="w-full h-full flex items-center justify-center">
              <Spin />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="flex-grow overflow-y-auto p-3 pt-1">
                {recentStickers.length > 0 && (
                  <>
                    <h1 className="mt-2" id="sticker-recent">
                      Recent stickers
                    </h1>
                    <div className="w-full grid grid-cols-5 justify-between">
                      {recentStickers.map((url) => (
                        <SpriteRenderer
                          size={60}
                          onClick={() => {
                            onSelect(url);
                            addRecentSticker(url);
                            setIsOpened(false);
                          }}
                          className="hover:bg-dark-lighten cursor-pointer"
                          src={url}
                          runOnHover
                        />
                      ))}
                    </div>
                  </>
                )}

                {data?.map((collection) => (
                  <>
                    <h1 className="mt-2" id={`sticker-${collection.id}`}>
                      {collection.name}
                    </h1>
                    <div className="w-full grid grid-cols-5 justify-between">
                      {collection.stickers.map((sticker) => (
                        <InView key={sticker.spriteURL} rootMargin="-100px">
                          {({ inView, ref }) => (
                            <div className="w-[60px] h-[60px]" ref={ref}>
                              {inView && (
                                <SpriteRenderer
                                  size={60}
                                  onClick={() => {
                                    onSelect(sticker.spriteURL);
                                    addRecentSticker(sticker.spriteURL);
                                    setIsOpened(false);
                                  }}
                                  className="hover:bg-dark-lighten cursor-pointer"
                                  src={sticker.spriteURL}
                                  runOnHover
                                />
                              )}
                            </div>
                          )}
                        </InView>
                      ))}
                    </div>
                  </>
                ))}
              </div>

              <div className="flex-shrink-0 h-18 flex gap-2 w-full overflow-x-auto border-t border-t-dark-lighten p-2">
                {recentStickers.length > 0 && (
                  <button
                    onClick={() =>
                      document
                        .querySelector(`#sticker-recent`)
                        ?.scrollIntoView()
                    }
                    className="w-9 h-9 flex items-center"
                  >
                    <i className="bx bx-time text-[26px] leading-[26px]"></i>
                  </button>
                )}
                {data?.map((collection) => (
                  <img
                    onClick={() =>
                      document
                        .querySelector(`#sticker-${collection.id}`)
                        ?.scrollIntoView()
                    }
                    className="w-9 h-9 object-cover cursor-pointer"
                    src={collection.icon}
                    alt=""
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ClickAwayListener>
  );
};

export default StickerPicker;
