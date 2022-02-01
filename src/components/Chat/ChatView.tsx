import { ConversationInfo, MessageItem } from "../../shared/types";
import { FC, Fragment, useEffect, useRef } from "react";
import { collection, limitToLast, orderBy, query } from "firebase/firestore";

import AvatarFromId from "./AvatarFromId";
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
      className="flex flex-col items-stretch gap-3 py-3 h-[calc(100vh-144px)] overflow-x-hidden overflow-y-auto"
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
            .map((doc) => doc.data() as MessageItem)
            .map((item, index) => (
              <Fragment key={item.createdAt?.nanoseconds || Date.now()}>
                {item.sender === currentUser?.uid ? (
                  <div className="flex flex-row-reverse items-center px-8">
                    {item.type === "text" ? (
                      <div className="bg-primary text-white p-2 rounded-lg relative after:absolute after:left-full after:bottom-[6px] after:border-8 after:border-primary after:border-t-transparent after:border-r-transparent">
                        {item.content}
                      </div>
                    ) : (
                      <img className="max-w-[60%]" src={item.content} alt="" />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center px-8 gap-2">
                    {conversation.users.length > 2 &&
                      data.docs[index - 1]?.data()?.sender !== item.sender && (
                        <AvatarFromId uid={item.sender} />
                      )}
                    {conversation.users.length > 2 &&
                      data.docs[index - 1]?.data()?.sender === item.sender && (
                        <div className="w-[30px] h-[30px]"></div>
                      )}
                    {item.type === "text" ? (
                      <div
                        className={`bg-dark-lighten text-white p-2 rounded-lg ${
                          conversation.users.length === 2
                            ? "relative after:absolute after:right-full after:bottom-[6px] after:border-8 after:border-dark-lighten after:border-t-transparent after:border-l-transparent"
                            : ""
                        }`}
                      >
                        {item.content}
                      </div>
                    ) : (
                      <img className="max-w-[60%]" src={item.content} alt="" />
                    )}
                  </div>
                )}
              </Fragment>
            ))}
        </>
      )}
    </div>
  );
};

export default ChatView;
