import { ConversationInfo, MessageItem } from "../../shared/types";
import { FC, useState } from "react";

import AvatarFromId from "./AvatarFromId";
import ClickAwayListener from "../ClickAwayListener";
import ReactionPopup from "./ReactionPopup";
import ReactionStatus from "./ReactionStatus";
import SpriteRenderer from "../SpriteRenderer";
import { formatFileSize } from "../../shared/utils";
import { useStore } from "../../store";

interface RightMessageProps {
  message: MessageItem;
  conversation: ConversationInfo;
  index: number;
  docs: any[];
}

const RightMessage: FC<RightMessageProps> = ({
  message,
  conversation,
  index,
  docs,
}) => {
  const [isSelectReactionOpened, setIsSelectReactionOpened] = useState(false);
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div
      className={`flex items-center px-8 gap-2 group relative ${
        Object.keys(message.reactions || {}).length > 0 ? "mb-2" : ""
      }`}
    >
      {conversation.users.length > 2 && (
        <div className="h-full py-1">
          <div className="w-[30px] h-[30px]">
            {docs[index - 1]?.data()?.sender !== message.sender && (
              <AvatarFromId uid={message.sender} />
            )}
          </div>
        </div>
      )}

      {message.type === "text" ? (
        <div
          className={`bg-dark-lighten text-white p-2 rounded-lg ${
            conversation.users.length === 2
              ? "relative after:absolute after:right-full after:bottom-[6px] after:border-8 after:border-dark-lighten after:border-t-transparent after:border-l-transparent"
              : ""
          }`}
        >
          {message.content}
        </div>
      ) : message.type === "image" ? (
        <img className="max-w-[60%]" src={message.content} alt="" />
      ) : message.type === "file" ? (
        <div className="bg-dark-lighten flex items-center gap-2 rounded-lg overflow-hidden py-3 px-5">
          <div>
            <p className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
              {message.file?.name}
            </p>

            <p className="text-sm text-gray-400">
              {formatFileSize(message.file?.size as number)}
            </p>
          </div>

          <a
            href={message.content}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bx bxs-download text-2xl"></i>
          </a>
        </div>
      ) : message.type === "sticker" ? (
        <SpriteRenderer src={message.content} size={130} />
      ) : (
        <div className="p-3 border border-dark-lighten rounded-lg text-gray-400">
          Message has been removed
        </div>
      )}

      {message.type !== "removed" && (
        <>
          <button
            onClick={() => setIsSelectReactionOpened(true)}
            className="text-gray-500 hover:text-gray-300 text-lg transition opacity-0 group-hover:opacity-100"
          >
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

          {isSelectReactionOpened && (
            <ClickAwayListener
              onClickAway={() => setIsSelectReactionOpened(false)}
            >
              {(ref) => (
                <ReactionPopup
                  position={"left"}
                  forwardedRef={ref}
                  setIsOpened={setIsSelectReactionOpened}
                  messageId={message.id as string}
                  currentReaction={
                    message.reactions?.[currentUser?.uid as string] || 0
                  }
                />
              )}
            </ClickAwayListener>
          )}
        </>
      )}
      {Object.keys(message.reactions || {}).length > 0 && (
        <ReactionStatus
          message={message}
          position={conversation.users.length > 2 ? "left-tab" : "left"}
        />
      )}
    </div>
  );
};

export default RightMessage;
