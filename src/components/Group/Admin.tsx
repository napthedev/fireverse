import { ConversationInfo, SavedUser } from "../../shared/types";
import { FC, useState } from "react";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";

import { IMAGE_PROXY } from "../../shared/constants";
import Spin from "react-cssfx-loading/src/Spin";
import { db } from "../../shared/firebase";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";
import { useUsersInfo } from "../../hooks/useUsersInfo";

interface AdminProps {
  conversation: ConversationInfo;
}

const Admin: FC<AdminProps> = ({ conversation }) => {
  const { id: conversationId } = useParams();

  const currentUser = useStore((state) => state.currentUser);

  const { data, loading, error } = useUsersInfo(
    conversation.group?.admins as string[]
  );

  const handleRemoveAdminPosition = (uid: string) => {
    updateDoc(doc(db, "conversations", conversationId as string), {
      "group.admins": arrayRemove(uid),
      "group.groupImage": conversation.group?.groupImage,
      "group.groupName": conversation.group?.groupName,
    });
  };

  if (loading || error)
    return (
      <div className="h-80 flex justify-center items-center">
        <Spin />
      </div>
    );

  return (
    <div className="h-80 flex flex-col items-stretch py-4 gap-4 overflow-y-auto overflow-x-hidden">
      {data
        ?.map((item) => item.data() as SavedUser)
        .map((user) => (
          <div key={user.uid} className="flex gap-3 items-center px-4">
            <img
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              src={IMAGE_PROXY(user.photoURL)}
              alt=""
            />

            <div className="flex-grow">
              <h1>{user.displayName}</h1>
            </div>

            {conversation.group?.admins?.includes(currentUser?.uid as string) &&
              user.uid !== currentUser?.uid && (
                <div className="flex-shrink-0 group relative" tabIndex={0}>
                  <button>
                    <i className="bx bx-dots-horizontal-rounded text-2xl"></i>
                  </button>

                  <div className="group-focus-within:!opacity-100 group-focus-within:!visible opacity-0 invisible transition-all duration-300 absolute top-full right-0 flex flex-col items-stretch rounded-lg bg-dark-lighten border border-dark-lighten w-max py-1 z-[1]">
                    <button
                      onClick={() => handleRemoveAdminPosition(user.uid)}
                      className="flex items-center gap-1 px-3 py-1 bg-dark-lighten hover:brightness-125 transition duration-300"
                    >
                      <i className="bx bx-user-x text-2xl"></i>
                      <span>Remove admin position</span>
                    </button>
                  </div>
                </div>
              )}
          </div>
        ))}
    </div>
  );
};

export default Admin;
