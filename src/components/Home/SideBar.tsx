import { DEFAULT_AVATAR, IMAGE_PROXY } from "../../shared/constants";
import { FC, useState } from "react";

import ClickAwayListener from "../ClickAwayListener";
import { auth } from "../../shared/firebase";
import { signOut } from "firebase/auth";
import { useStore } from "../../store";

const SideBar: FC = () => {
  const currentUser = useStore((state) => state.currentUser);

  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div className="w-[350px] flex-shrink-0 border-r border-dark-lighten h-screen">
      <div className="flex justify-between h-20 items-center px-5">
        <div className="flex items-center gap-1">
          <img className="w-8 h-8" src="/icon.svg" alt="" />
          <h1 className="text-xl">FireVerse</h1>
        </div>

        <ClickAwayListener onClickAway={() => setIsDropdownOpened(false)}>
          {(ref) => (
            <div ref={ref} className="relative">
              <img
                onClick={() => setIsDropdownOpened((prev) => !prev)}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                src={
                  currentUser?.photoURL
                    ? IMAGE_PROXY(currentUser.photoURL)
                    : DEFAULT_AVATAR
                }
                alt=""
              />

              <div
                className={`absolute top-full right-0 shadow-lg border border-dark-lighten flex flex-col items-stretch bg-dark w-max rounded-md overflow-hidden py-1 transition-all duration-200 origin-top-right ${
                  isDropdownOpened
                    ? "opacity-100 visible scale-100"
                    : "opacity-0 invisible scale-0"
                }`}
              >
                <button className="flex items-center gap-1 px-3 py-1 hover:bg-dark-lighten transition duration-300">
                  <i className="bx bxs-user text-xl"></i>
                  <span className="whitespace-nowrap">Profile</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 px-3 py-1 hover:bg-dark-lighten transition duration-300"
                >
                  <i className="bx bx-log-out text-xl"></i>
                  <span className="whitespace-nowrap">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </ClickAwayListener>
      </div>
    </div>
  );
};

export default SideBar;
