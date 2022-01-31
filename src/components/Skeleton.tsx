import { FC, HTMLProps } from "react";

const Skeleton: FC<HTMLProps<HTMLDivElement>> = ({ className, ...others }) => {
  return (
    <div className={`bg-gray-500 animate-pulse ${className}`} {...others}></div>
  );
};

export default Skeleton;
