import { ConversationInfo } from "../../shared/types";
import { FC } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import { Link } from "react-router-dom";
import Skeleton from "../Skeleton";
import { useStore } from "../../store";
import { useUsersInfo } from "../../hooks/useUsersInfo";

interface ChatHeaderProps {
  conversation: ConversationInfo;
}

const ChatHeader: FC<ChatHeaderProps> = ({ conversation }) => {
  const { data: users, loading } = useUsersInfo(conversation.users);
  const currentUser = useStore((state) => state.currentUser);

  const filtered = users?.filter((user) => user.id !== currentUser?.uid);

  return (
    <div className="h-20 flex items-center justify-between px-5 border-b border-dark-lighten">
      <div className="flex items-center gap-3 flex-grow">
        <Link to="/" className="md:hidden">
          <i className="bx bxs-chevron-left text-3xl text-primary"></i>
        </Link>
        {loading ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : (
          <>
            {conversation.users.length === 2 ? (
              <img
                className="h-10 w-10 rounded-full"
                src={IMAGE_PROXY(filtered?.[0]?.data()?.photoURL)}
                alt=""
              />
            ) : (
              <div className="h-10 w-10 relative flex-shrink-0">
                <img
                  className="w-7 h-7 rounded-full flex-shrink-0 object-cover absolute top-0 right-0"
                  src={IMAGE_PROXY(filtered?.[0]?.data()?.photoURL)}
                  alt=""
                />
                <img
                  className={`w-7 h-7 rounded-full flex-shrink-0 object-cover absolute bottom-0 left-0 z-[1] border-2 border-dark transition duration-300`}
                  src={IMAGE_PROXY(filtered?.[1]?.data()?.photoURL)}
                  alt=""
                />
              </div>
            )}
          </>
        )}

        {loading ? (
          <Skeleton className="h-6 w-1/4" />
        ) : (
          <p>{filtered?.map((user) => user.data()?.displayName).join(", ")}</p>
        )}
      </div>

      {!loading && (
        <button>
          <i className="bx bxs-info-circle text-2xl text-primary"></i>
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
