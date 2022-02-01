import { Link, useParams } from "react-router-dom";

import { ConversationInfo } from "../../shared/types";
import { FC } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import Skeleton from "../Skeleton";
import { useLastMessage } from "../../hooks/useLastMessage";
import { useStore } from "../../store";
import { useUsersInfo } from "../../hooks/useUsersInfo";

interface SelectConversationProps {
  conversation: ConversationInfo;
  conversationId: string;
}

const SelectConversation: FC<SelectConversationProps> = ({
  conversation,
  conversationId,
}) => {
  const { data: users, loading } = useUsersInfo(conversation.users);
  const currentUser = useStore((state) => state.currentUser);

  const filtered = users?.filter((user) => user.id !== currentUser?.uid);

  const { id } = useParams();

  const {
    data: lastMessage,
    loading: lastMessageLoading,
    error: lastMessageError,
  } = useLastMessage(conversationId);

  if (loading)
    return (
      <div className="flex items-stretch py-2 px-5 gap-2">
        <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
        <div className="flex-grow flex flex-col items-start py-2 gap-2">
          <Skeleton className="w-1/2 flex-grow" />
          <Skeleton className="w-2/3 flex-grow" />
        </div>
      </div>
    );

  if (conversation.users.length === 2)
    return (
      <Link
        to={`/${conversationId}`}
        className={`flex items-stretch py-2 px-5 gap-2 hover:bg-dark-lighten transition duration-300 ${
          conversationId === id ? "!bg-[#263342]" : ""
        }`}
      >
        <img
          className="w-14 h-1/4 rounded-full flex-shrink-0 object-cover"
          src={IMAGE_PROXY(filtered?.[0]?.data()?.photoURL)}
          alt=""
        />
        <div className="flex-grow flex flex-col items-start py-1 gap-1">
          <p className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px]">
            {filtered?.[0].data()?.displayName}
          </p>
          {lastMessageLoading ? (
            <Skeleton className="w-2/3 flex-grow" />
          ) : (
            <p className="flex-grow text-sm text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px]">
              {lastMessage}
            </p>
          )}
        </div>
      </Link>
    );

  return (
    <Link
      to={`/${conversationId}`}
      className={`flex items-stretch py-2 px-5 gap-2 hover:bg-dark-lighten group transition duration-300 ${
        conversationId === id ? "!bg-[#252F3C]" : ""
      }`}
    >
      <div className="w-14 h-14 relative">
        <img
          className="w-10 h-10 rounded-full flex-shrink-0 object-cover absolute top-0 right-0"
          src={IMAGE_PROXY(filtered?.[0]?.data()?.photoURL)}
          alt=""
        />
        <img
          className={`w-10 h-10 rounded-full flex-shrink-0 object-cover absolute bottom-0 left-0 z-[1] border-4 border-dark group-hover:border-dark-lighten transition duration-300 ${
            conversationId === id ? "!border-[#252F3C]" : ""
          }`}
          src={IMAGE_PROXY(filtered?.[1]?.data()?.photoURL)}
          alt=""
        />
      </div>
      <div className="flex-grow flex flex-col items-start py-1 gap-1">
        <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px]">
          {filtered?.map((user) => user.data()?.displayName).join(", ")}
        </p>
        {lastMessageLoading ? (
          <Skeleton className="w-2/3 flex-grow" />
        ) : (
          <p className="flex-grow text-sm text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px]">
            {lastMessage}
          </p>
        )}
      </div>
    </Link>
  );
};

export default SelectConversation;
