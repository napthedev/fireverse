import { ConversationInfo, SavedUser } from "../../shared/types";
import {
  arrayUnion,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { FC } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import Spin from "react-cssfx-loading/src/Spin";
import { db } from "../../shared/firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useParams } from "react-router-dom";

interface AddMembersProps {
  conversations: ConversationInfo;
}

const AddMembers: FC<AddMembersProps> = ({ conversations }) => {
  const { id: conversationId } = useParams();

  const { data, loading, error } = useCollectionQuery(
    `all-users-except-${JSON.stringify(conversations.users)}`,
    query(collection(db, "users"), where("uid", "not-in", conversations.users))
  );

  const handleAddMember = (uid: string) => {
    updateDoc(doc(db, "conversations", conversationId as string), {
      users: arrayUnion(uid),
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
      {data?.docs
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
            <button onClick={() => handleAddMember(user.uid)}>
              <i className="bx bx-plus text-2xl"></i>
            </button>
          </div>
        ))}
    </div>
  );
};

export default AddMembers;
