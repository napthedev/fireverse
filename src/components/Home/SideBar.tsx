import { DEFAULT_AVATAR, IMAGE_PROXY } from "../../shared/constants";
import { FC, useState } from "react";
import { collection, orderBy, query, where } from "firebase/firestore";

import ClickAwayListener from "../ClickAwayListener";
import { ConversationInfo } from "../../shared/types";
import CreateConversation from "./CreateConversation";
import { Link } from "react-router-dom";
import SelectConversation from "./SelectConversation";
import Skeleton from "../Skeleton";
import { auth } from "../../shared/firebase";
import { db } from "../../shared/firebase";
import { signOut } from "firebase/auth";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useStore } from "../../store";

const SideBar: FC = () => {
  const currentUser = useStore((state) => state.currentUser);

  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [createConversationOpened, setCreateConversationOpened] =
    useState(false);

  const { data, error, loading } = useCollectionQuery(
    "conversations",
    query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc"),
      where("users", "array-contains", currentUser?.uid)
    )
  );

  return (
    <>
      <div className="w-[350px] flex-shrink-0 border-r border-dark-lighten h-screen overflow-y-auto overflow-x-hidden">
        <div className="flex justify-between h-20 items-center px-6">
          <Link to="/" className="flex items-center gap-1">
            <img className="w-8 h-8" src="/icon.svg" alt="" />
            <h1 className="text-xl">FireVerse</h1>
          </Link>

          <div className="flex gap-1 items-center">
            <button
              onClick={() => setCreateConversationOpened(true)}
              className="bg-dark-lighten h-8 w-8 rounded-full"
            >
              <i className="bx bxs-edit text-xl"></i>
            </button>

            <ClickAwayListener onClickAway={() => setIsDropdownOpened(false)}>
              {(ref) => (
                <div ref={ref} className="relative z-10">
                  <img
                    onClick={() => setIsDropdownOpened((prev) => !prev)}
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
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
                      onClick={() => signOut(auth)}
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
        <div className="relative h-10 mx-5 mb-5">
          <button className="absolute top-1/2 -translate-y-1/2 left-2">
            <i className="bx bx-search text-xl text-gray-400"></i>
          </button>
          <input
            className="outline-none bg-dark-lighten h-full w-full rounded-md pl-8 pr-3"
            type="text"
            placeholder="Search for users, conversations..."
          />
        </div>

        {loading ? (
          <div>
            {[...new Array(20)].map((_, index) => (
              <div key={index} className="flex items-stretch py-2 px-5 gap-2">
                <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
                <div className="flex-grow flex flex-col items-start py-2 gap-2">
                  <Skeleton className="w-1/2 flex-grow" />
                  <Skeleton className="w-2/3 flex-grow" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.docs.length === 0 ? (
          <div className="flex-grow flex flex-col justify-center items-center">
            <p className="text-center">No conversation found</p>
            <button
              onClick={() => setCreateConversationOpened(true)}
              className="text-center text-primary"
            >
              Create one
            </button>
          </div>
        ) : (
          <div>
            {data?.docs.map((item) => (
              <SelectConversation
                key={item.id}
                conversation={item.data() as ConversationInfo}
                conversationId={item.id}
              />
            ))}
          </div>
        )}
      </div>

      {createConversationOpened && (
        <CreateConversation setIsOpened={setCreateConversationOpened} />
      )}
    </>
  );
};

export default SideBar;
