import { FC, useRef, useState } from "react";

import ClickAwayListener from "../ClickAwayListener";
import Spin from "react-cssfx-loading/src/Spin";
import configs from "../../shared/configs";
import { useFetch } from "../../hooks/useFetch";

interface GifPickerProps {
  setIsOpened: (value: boolean) => void;
  onSelect: (gif: any) => void;
}

const GifPicker: FC<GifPickerProps> = ({ setIsOpened, onSelect }) => {
  const [searchInputValue, setSearchInputValue] = useState("");

  const timeOutRef = useRef<any>(null);

  const { data, loading, error } = useFetch(`giphy-${searchInputValue}`, () =>
    fetch(
      searchInputValue.trim()
        ? `https://api.giphy.com/v1/gifs/search?api_key=${
            configs.giphyAPIKey
          }&q=${encodeURIComponent(searchInputValue.trim())}`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${configs.giphyAPIKey}`
    ).then((res) => res.json())
  );

  return (
    <ClickAwayListener onClickAway={() => setIsOpened(false)}>
      {(ref) => (
        <div
          ref={ref}
          className="absolute left-[-92px] bottom-full bg-[#222222] border-dark-lighten border-2 shadow-2xl rounded-lg w-96 h-96 p-4 flex flex-col items-stretch"
        >
          <div className="relative">
            <input
              onChange={(e) => {
                if (timeOutRef.current) clearTimeout(timeOutRef.current);
                timeOutRef.current = setTimeout(() => {
                  setSearchInputValue(e.target.value);
                }, 500);
              }}
              type="text"
              className="w-full rounded-full bg-dark-lighten outline-none pl-10 pr-4 py-2"
              placeholder="Search..."
            />
            <i className="bx bx-search absolute top-1/2 -translate-y-1/2 left-3 text-xl"></i>
          </div>

          {loading ? (
            <div className="flex-grow flex justify-center items-center">
              <Spin />
            </div>
          ) : error ? (
            <div className="flex-grow flex flex-col justify-center items-center">
              <p className="text-center">
                Sorry... Giphy has limited the request
              </p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto flex flex-wrap mt-3 gap-2">
              {(data as any).data.map((item: any) => (
                <img
                  key={item.id}
                  onClick={() => {
                    onSelect(item?.images?.original?.url);
                    setIsOpened(false);
                  }}
                  className="flex-1 h-[100px] object-cover cursor-pointer"
                  src={item?.images?.original?.url}
                  alt=""
                />
              ))}
            </div>
          )}
        </div>
      )}
    </ClickAwayListener>
  );
};

export default GifPicker;
