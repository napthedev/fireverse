import { FC, useEffect } from "react";

interface AlertProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  text: string;
  isError?: boolean;
  duration?: number;
}

const Alert: FC<AlertProps> = ({
  isOpened,
  setIsOpened,
  text,
  isError = false,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isOpened) {
      setTimeout(() => {
        setIsOpened(false);
      }, duration);
    }
  }, [isOpened]);

  return (
    <div
      className={`fixed top-5 right-5 ${
        isError ? "bg-red-500" : "bg-[#323232]"
      } text-white p-4 rounded w-[calc(100vw-40px)] max-w-[300px] z-[9999] scale-100 transition-all duration-300 ${
        isOpened
          ? "opacity-100 visible scale-100"
          : "opacity-0 invisible scale-50"
      }`}
    >
      {text}
    </div>
  );
};

export default Alert;
