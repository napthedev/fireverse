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
      className={`fixed top-0 left-0 w-full h-full bg-[#00000080] transition duration-300 flex justify-center items-center z-20 ${
        isOpened ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {src && (
        <img
          onClick={(e) => e.stopPropagation()}
          src={src}
          className="w-auto h-auto max-w-full max-h-full"
        />
      )}

      <button
        onClick={() => setIsOpened(false)}
        className="fixed right-2 top-2 z-30 w-10 h-10 rounded-full bg-dark-lighten hover:brightness-125 transition duration-300 text-white flex justify-center items-center"
      >
        <i className="bx bx-x text-4xl"></i>
      </button>
    </div>
  );
};

export default ImageView;
