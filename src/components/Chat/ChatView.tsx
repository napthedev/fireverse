import { collection, limitToLast, orderBy, query } from "firebase/firestore";

import { FC } from "react";
import { MessageItem } from "../../shared/types";
import { db } from "../../shared/firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";

const ChatView: FC = () => {
  const { id: conversationId } = useParams();

  const currentUser = useStore((state) => state.currentUser);

  const { data } = useCollectionQuery(
    `conversation-data-${conversationId}`,
    query(
      collection(db, "conversations", conversationId as string, "messages"),
      orderBy("createdAt"),
      limitToLast(20)
    )
  );

  return (
    <div className="flex-grow flex flex-col justify-end items-stretch gap-3 py-3">
      {data?.docs
        .map((doc) => doc.data() as MessageItem)
        .map((item) => (
          <>
            {item.sender === currentUser?.uid ? (
              <div className="flex flex-row-reverse items-center px-8">
                {item.type === "text" ? (
                  <div className="bg-primary text-white p-2 rounded-lg relative after:absolute after:left-full after:bottom-[6px] after:border-8 after:border-primary after:border-t-transparent after:border-r-transparent">
                    {item.content}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ) : (
              <div className="flex items-center px-8">
                {item.type === "text" ? (
                  <div className="bg-dark-lighten text-white p-2 rounded-lg relative after:absolute after:right-full after:bottom-[6px] after:border-8 after:border-dark-lighten after:border-t-transparent after:border-l-transparent">
                    {item.content}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            )}
          </>
        ))}
    </div>
  );
};

export default ChatView;
