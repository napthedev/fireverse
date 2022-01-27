import { FC } from "react";
import { useQueryParams } from "../hooks/useQueryParams";

const SignIn: FC = () => {
  const { redirect } = useQueryParams();

  return (
    <div className="flex mx-[10vw] gap-12">
      <div className="flex-1">
        <img className="w-full h-auto" src="/illustration.svg" alt="" />
      </div>

      <div className="flex-1"></div>
    </div>
  );
};

export default SignIn;
