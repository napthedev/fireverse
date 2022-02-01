import ChatHeader from "../components/Chat/ChatHeader";
import ChatView from "../components/Chat/ChatView";
import { ConversationInfo } from "../shared/types";
import { FC } from "react";
import InputSection from "../components/Chat/InputSection";
import SideBar from "../components/Home/SideBar";
import Skeleton from "../components/Skeleton";
import { db } from "../shared/firebase";
import { doc } from "firebase/firestore";
import { useDocumentQuery } from "../hooks/useDocumentQuery";
import { useParams } from "react-router-dom";
import { useStore } from "../store";

const Chat: FC = () => {
  const { id } = useParams();

  const { data, loading, error } = useDocumentQuery(
    `conversation-${id}`,
    doc(db, "conversations", id as string)
  );

  const conversation = data?.data() as ConversationInfo;

  const currentUser = useStore((state) => state.currentUser);

  return (
    <div className="flex">
      <SideBar />

      <div className="flex-grow flex flex-col items-stretch">
        {loading ? (
          <div className="h-20 flex items-center justify-between px-5 border-b border-dark-lighten">
            <div className="flex items-center gap-4 flex-grow">
              <Skeleton className="h-10 w-10 rounded-full" />

              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        ) : !conversation ||
          error ||
          !conversation.users.includes(currentUser?.uid as string) ? (
          <div className="w-full h-full flex flex-col justify-center items-center gap-6">
            <img className="w-32 h-32 object-cover" src="/error.svg" alt="" />
            <p className="text-lg text-center">Conversation does not exists</p>
          </div>
        ) : (
          <>
            <ChatHeader conversation={conversation} />
            <ChatView conversation={conversation} />
            <InputSection />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
