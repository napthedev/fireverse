import ClickAwayListener from "../ClickAwayListener";
import { FC } from "react";
import { STICKERS_URL } from "../../shared/constants";
import Spin from "react-cssfx-loading/src/Spin";
import SpriteRenderer from "../SpriteRenderer";
import { StickerCollections } from "../../shared/types";
import { useFetch } from "../../hooks/useFetch";

interface StickerPickerOpened {
  setIsOpened: (value: boolean) => void;
  onSelect: (value: string) => void;
}

const StickerPicker: FC<StickerPickerOpened> = ({ setIsOpened, onSelect }) => {
  const { data, loading, error } = useFetch<StickerCollections>("sticker", () =>
    fetch(STICKERS_URL).then((res) => res.json())
  );

  return (
    <ClickAwayListener onClickAway={() => setIsOpened(false)}>
      {(ref) => (
        <div
          ref={ref}
          className="absolute -left-16 bottom-full bg-dark border-dark-lighten border-2 shadow-2xl rounded-lg w-96 h-96"
        >
          {loading || error ? (
            <div className="w-full h-full flex items-center justify-center">
              <Spin />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="flex-grow overflow-y-auto p-3">
                {data?.map((collection) => (
                  <>
                    <h1 id={`sticker-${collection.id}`}>{collection.name}</h1>
                    <div className="w-full grid grid-cols-5 justify-between">
                      {collection.stickers.map((sticker) => (
                        <SpriteRenderer
                          onClick={() => {
                            onSelect(sticker.spriteURL);
                            setIsOpened(false);
                          }}
                          className="hover:bg-dark-lighten cursor-pointer"
                          src={sticker.spriteURL}
                          runOnHover
                        />
                      ))}
                    </div>
                  </>
                ))}
              </div>

              <div className="flex-shrink-0 h-18 flex gap-2 w-full overflow-x-auto border-t border-t-dark-lighten p-2">
                {data?.map((collection) => (
                  <img
                    onClick={() => {
                      document
                        .querySelector(`#sticker-${collection.id}`)
                        ?.scrollIntoView();
                    }}
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
