import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useQueryParams } from "../hooks/useQueryParams";
import { useStore } from "../store";

const SignIn: FC = () => {
  const { redirect } = useQueryParams();

  const currentUser = useStore((state) => state.currentUser);

  if (currentUser) return <Navigate to={redirect || "/"} />;

  return (
    <div className="mx-[5vw] my-5 lg:my-10 flex justify-center">
      <div className="max-w-[1100px] w-full">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <img className="w-8 h-8" src="/icon.svg" alt="" />
            <span className="text-2xl">FireVerse</span>
          </div>
          <a
            href="https://github.com/napthedev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl flex items-center gap-1"
          >
            <i className="bx bxl-github"></i>
            <span>Github</span>
          </a>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-10 md:gap-5 md:mt-5 lg:mt-10">
          <div className="flex-1">
            <img className="w-full h-auto" src="/illustration.svg" alt="" />
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start mt-12 lg:mt-24 gap-4">
            <h1 className="text-3xl md:text-4xl text-center md:text-left">
              The best place for messaging
            </h1>
            <p className="text-xl md:text-2xl text-center md:text-left">
              It's free, fast and secure. We make it easy and fun to stay close
              to your favourite people.
            </p>

            <button
              // disabled={loading}
              // onClick={() => handleSignIn(new GoogleAuthProvider())}
              className="flex items-center bg-white text-black p-3 gap-3 rounded-md cursor-pointer hover:brightness-90 disabled:!brightness-75 disabled:!cursor-default transition duration-300 min-w-[250px]"
            >
              <img className="w-6 h-6" src="/google.svg" alt="" />

              <span>Sign In With Google</span>
            </button>

            <button
              // disabled={loading}
              // onClick={() => handleSignIn(new FacebookAuthProvider())}
              className="flex items-center bg-primary text-white p-3 gap-3 rounded-md cursor-pointer hover:brightness-90 disabled:!brightness-75 disabled:!cursor-default transition duration-300 min-w-[250px]"
            >
              <img className="w-6 h-6" src="/facebook.svg" alt="" />

              <span>Sign In With Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
