import { ConversationInfo, MessageItem } from "../../shared/types";
import { FC, Fragment, useEffect, useRef } from "react";
import {
  collection,
  doc,
  limitToLast,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import AvatarFromId from "./AvatarFromId";
import Spin from "react-cssfx-loading/src/Spin";
import { db } from "../../shared/firebase";
import { formatFileSize } from "../../shared/utils";
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

  const removeMessage = (messageId: string) => {
    updateDoc(
      doc(db, "conversations", conversationId as string, "messages", messageId),
      {
        type: "removed",
        file: null,
        content: "",
      }
    );
  };

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
            .map(
              (doc) =>
                ({ id: doc.id, ...doc.data() } as MessageItem & { id: string })
            )
            .map((item, index) => (
              <Fragment key={item.createdAt?.nanoseconds || Date.now()}>
                {item.sender === currentUser?.uid ? (
                  <div className="flex flex-row-reverse items-center px-8 gap-2 group">
                    {item.type === "text" ? (
                      <div className="bg-primary text-white p-2 rounded-lg relative after:absolute after:left-full after:bottom-[6px] after:border-8 after:border-primary after:border-t-transparent after:border-r-transparent">
                        {item.content}
                      </div>
                    ) : item.type === "image" ? (
                      <img className="max-w-[60%]" src={item.content} alt="" />
                    ) : item.type === "file" ? (
                      <div className="bg-dark-lighten flex items-center gap-2 rounded-lg overflow-hidden py-3 px-5">
                        <div>
                          <p className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {item.file?.name}
                          </p>

                          <p className="text-sm text-gray-400">
                            {formatFileSize(item.file?.size as number)}
                          </p>
                        </div>

                        <a
                          href={item.content}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="bx bxs-download text-2xl"></i>
                        </a>
                      </div>
                    ) : (
                      <div className="p-3 border border-dark-lighten rounded-lg text-gray-400">
                        Message has been removed
                      </div>
                    )}

                    {item.type !== "removed" && (
                      <>
                        <button className="text-gray-500 hover:text-gray-300 text-lg transition opacity-0 group-hover:opacity-100">
                          <i className="bx bx-smile"></i>
                        </button>

                        <button className="text-gray-500 hover:text-gray-300 transition opacity-0 group-hover:opacity-100">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="m10 7.002v-4.252c0-.301-.181-.573-.458-.691-.276-.117-.599-.058-.814.153l-8.5 8.25c-.146.141-.228.335-.228.538s.082.397.228.538l8.5 8.25c.217.21.539.269.814.153.277-.118.458-.39.458-.691v-4.25h1.418c4.636 0 8.91 2.52 11.153 6.572l.021.038c.134.244.388.39.658.39.062 0 .124-.007.186-.023.332-.085.564-.384.564-.727 0-7.774-6.257-14.114-14-14.248z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => removeMessage(item.id)}
                          className="text-gray-500 hover:text-gray-300 text-lg transition opacity-0 group-hover:opacity-100"
                        >
                          <i className="bx bxs-trash"></i>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center px-8 gap-2 group">
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
                    ) : item.type === "image" ? (
                      <img className="max-w-[60%]" src={item.content} alt="" />
                    ) : item.type === "file" ? (
                      <div className="bg-dark-lighten flex items-center gap-2 rounded-lg overflow-hidden py-3 px-5">
                        <div>
                          <p className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {item.file?.name}
                          </p>

                          <p className="text-sm text-gray-400">
                            {formatFileSize(item.file?.size as number)}
                          </p>
                        </div>

                        <a
                          href={item.content}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="bx bxs-download text-2xl"></i>
                        </a>
                      </div>
                    ) : (
                      <div className="p-3 border border-dark-lighten rounded-lg text-gray-400">
                        Message has been removed
                      </div>
                    )}

                    {item.type !== "removed" && (
                      <>
                        <button className="text-gray-500 hover:text-gray-300 text-lg transition opacity-0 group-hover:opacity-100">
                          <i className="bx bx-smile"></i>
                        </button>

                        <button className="text-gray-500 hover:text-gray-300 transition opacity-0 group-hover:opacity-100">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="m10 7.002v-4.252c0-.301-.181-.573-.458-.691-.276-.117-.599-.058-.814.153l-8.5 8.25c-.146.141-.228.335-.228.538s.082.397.228.538l8.5 8.25c.217.21.539.269.814.153.277-.118.458-.39.458-.691v-4.25h1.418c4.636 0 8.91 2.52 11.153 6.572l.021.038c.134.244.388.39.658.39.062 0 .124-.007.186-.023.332-.085.564-.384.564-.727 0-7.774-6.257-14.114-14-14.248z" />
                          </svg>
                        </button>
                      </>
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
