import { FC, HTMLProps } from "react";

const Skeleton: FC<HTMLProps<HTMLDivElement>> = ({ className, ...others }) => {
  return (
    <div className={`animate-pulse bg-gray-500 ${className}`} {...others}></div>
  );
};

export default Skeleton;
