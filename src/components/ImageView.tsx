import { FC } from "react";

interface ImageViewProps {
  src: string;
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

const ImageView: FC<ImageViewProps> = ({ src, isOpened, setIsOpened }) => {
  return (
    <div
      onClick={() => setIsOpened(false)}
      className={`fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080] transition-all duration-300 ${
        isOpened ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      {src && (
        <img
          onClick={(e) => e.stopPropagation()}
          src={src}
          className="h-auto max-h-full w-auto max-w-full"
        />
      )}

      <button
        onClick={() => setIsOpened(false)}
        className="bg-dark-lighten fixed right-2 top-2 z-30 flex h-10 w-10 items-center justify-center rounded-full text-white transition duration-300 hover:brightness-125"
      >
        <i className="bx bx-x text-4xl"></i>
      </button>
    </div>
  );
};

export default ImageView;
