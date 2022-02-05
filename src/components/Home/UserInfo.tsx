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
      className={`fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080] transition-all duration-300 ${
        isOpened ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-dark mx-2 w-full max-w-[400px] rounded-lg"
      >
        <div className="border-dark-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1"></div>
          <div className="flex flex-1 items-center justify-center">
            <h1 className="whitespace-nowrap text-center text-2xl">
              Your Profile
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => setIsOpened(false)}
              className="bg-dark-lighten flex h-8 w-8 items-center justify-center rounded-full"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <img
              className="h-16 w-16 rounded-full object-cover"
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

          <p className="mt-4 text-gray-400">
            Change your google / facebook avatar or username to update it here
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
