import { FC } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import { useStore } from "../../store";

interface UserInfoProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

const UserInfo: FC<UserInfoProps> = ({ isOpened, setIsOpened }) => {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div
      onClick={() => setIsOpened(false)}
      className={`fixed top-0 left-0 w-full h-full bg-[#00000080] z-20 flex justify-center items-center transition-all duration-300 ${
        isOpened ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] mx-2 bg-dark rounded-lg"
      >
        <div className="py-3 border-b border-dark-lighten flex justify-between items-center px-3">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-center text-2xl whitespace-nowrap">
              Your Profile
            </h1>
          </div>
          <div className="flex-1 flex justify-end items-center">
            <button
              onClick={() => setIsOpened(false)}
              className="w-8 h-8 bg-dark-lighten rounded-full flex justify-center items-center"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <img
              className="w-16 h-16 rounded-full object-cover"
              src={IMAGE_PROXY(currentUser?.photoURL as string)}
              alt=""
            />
            <div>
              <h1 className="text-xl">{currentUser?.displayName}</h1>
              <p>ID: {currentUser?.uid}</p>
              <p>Email: {currentUser?.email || "None"}</p>
              <p>Phone Number: {currentUser?.phoneNumber || "None"}</p>
            </div>
          </div>

          <p className="text-gray-400 mt-4">
            Change your google / facebook avatar or username to update it here
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
