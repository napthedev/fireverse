import { ConversationInfo, MessageItem } from "../../shared/types";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import { collection, limitToLast, orderBy, query } from "firebase/firestore";

import InfiniteScroll from "react-infinite-scroll-component";
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

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const [limitCount, setLimitCount] = useState(10);

  const { data, loading, error } = useCollectionQuery(
    `conversation-data-${conversationId}-${limitCount}`,
    query(
      collection(db, "conversations", conversationId as string, "messages"),
      orderBy("createdAt"),
      limitToLast(limitCount)
    )
  );

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView();

    setTimeout(() => {
      scrollBottomRef.current?.scrollIntoView();
    }, 100);
  }, [data?.docs?.slice(-1)?.[0]?.id || ""]);

  if (loading)
    return (
      <div className="flex-grow flex justify-center items-center">
        <Spin />
      </div>
    );

  if (data?.empty)
    return (
      <div className="flex-grow">
        <p className="text-center text-gray-400">
          No message recently. Start chatting now.
        </p>
      </div>
    );

  return (
    <InfiniteScroll
      dataLength={data?.size as number}
      next={() => setLimitCount((prev) => prev + 10)}
      inverse
      hasMore={(data?.size as number) >= limitCount}
      loader={
        <div className="flex justify-center py-3">
          <Spin />
        </div>
      }
      style={{ display: "flex", flexDirection: "column-reverse" }}
      height="calc(100vh - 144px)"
    >
      <div className="flex flex-col items-stretch gap-3 pt-10 pb-1">
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
        <div ref={scrollBottomRef}></div>
      </div>
    </InfiniteScroll>
  );
};

export default ChatView;
