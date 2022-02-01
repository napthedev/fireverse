import { ConversationInfo, MessageItem } from "../../shared/types";
import { FC, Fragment, useEffect, useRef } from "react";
import { collection, limitToLast, orderBy, query } from "firebase/firestore";

import LeftMessage from "./LeftMessage";
import RightMessage from "./RightMessage";
import Spin from "react-cssfx-loading/src/Spin";
import { db } from "../../shared/firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";

interface ChatViewProps {
  conversation: ConversationInfo;
}

const ChatView: FC<ChatViewProps> = ({ conversation }) => {
  const { id: conversationId } = useParams();

  const currentUser = useStore((state) => state.currentUser);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useCollectionQuery(
    `conversation-data-${conversationId}`,
    query(
      collection(db, "conversations", conversationId as string, "messages"),
      orderBy("createdAt"),
      limitToLast(20)
    )
  );

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - containerRef.current.clientHeight;
    }
  }, [data?.docs?.length]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-stretch gap-3 pt-10 pb-3 h-[calc(100vh-144px)] overflow-x-hidden overflow-y-auto"
    >
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <>
          {data?.docs.length === 0 && (
            <p className="text-center text-gray-400">
              No message recently. Start chatting now.
            </p>
          )}
          {data?.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as MessageItem))
            .map((item, index) => (
              <Fragment key={item.id}>
                {item.sender === currentUser?.uid ? (
                  <RightMessage message={item} />
                ) : (
                  <LeftMessage
                    message={item}
                    index={index}
                    docs={data?.docs}
                    conversation={conversation}
                  />
                )}
              </Fragment>
            ))}
        </>
      )}
    </div>
  );
};

export default ChatView;
