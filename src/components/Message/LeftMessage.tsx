import { ConversationInfo, MessageItem } from "../../shared/types";
import { FC, useState } from "react";
import { formatDate, formatFileSize } from "../../shared/utils";

import AvatarFromId from "../Chat/AvatarFromId";
import ClickAwayListener from "../ClickAwayListener";
import { EMOJI_REGEX } from "../../shared/constants";
import ImageView from "../ImageView";
import ReactionPopup from "../Chat/ReactionPopup";
import ReactionStatus from "../Chat/ReactionStatus";
import ReplyBadge from "../Chat/ReplyBadge";
import ReplyIcon from "../Chat/ReplyIcon";
import SpriteRenderer from "../SpriteRenderer";
import { useStore } from "../../store";

interface LeftMessageProps {
  message: MessageItem;
  conversation: ConversationInfo;
  index: number;
  docs: any[];
  replyInfo: any;
  setReplyInfo: (value: any) => void;
}

const LeftMessage: FC<LeftMessageProps> = ({
  message,
  conversation,
  index,
  docs,
  setReplyInfo,
}) => {
  const [isSelectReactionOpened, setIsSelectReactionOpened] = useState(false);
  const currentUser = useStore((state) => state.currentUser);

  const [isImageViewOpened, setIsImageViewOpened] = useState(false);

  const formattedDate = formatDate(
    message.createdAt.seconds ? message.createdAt.seconds * 1000 : Date.now()
  );

  return (
    <div id={`message-${message.id}`}>
      <div
        className={`${
          conversation.users.length === 2 ? "px-8" : "px-[70px]"
        } flex -mb-2`}
      >
        {!!message.replyTo && (
          <ReplyBadge messageId={message.replyTo as string} />
        )}
      </div>
      <div
        onClick={(e) => {
          if (e.detail === 2 && message.type !== "removed") {
            setReplyInfo(message);
          }
        }}
        className={`flex items-center px-8 gap-2 group relative ${
          Object.keys(message.reactions || {}).length > 0 ? "mb-2" : ""
        }`}
      >
        {conversation.users.length > 2 && (
          <div onClick={(e) => e.stopPropagation()} className="h-full py-1">
            <div className="w-[30px] h-[30px]">
              {docs[index - 1]?.data()?.sender !== message.sender && (
                <AvatarFromId uid={message.sender} />
              )}
            </div>
          </div>
        )}

        {message.type === "text" ? (
          <>
            {EMOJI_REGEX.test(message.content) ? (
              <div
                onClick={(e) => e.stopPropagation()}
                title={formattedDate}
                className="text-4xl"
              >
                {message.content}
              </div>
            ) : (
              <div
                onClick={(e) => e.stopPropagation()}
                title={formattedDate}
                className={`bg-dark-lighten text-white p-2 rounded-lg ${
                  conversation.users.length === 2
                    ? "relative after:absolute after:right-full after:bottom-[6px] after:border-8 after:border-dark-lighten after:border-t-transparent after:border-l-transparent"
                    : ""
                }`}
              >
                {message.content}
              </div>
            )}
          </>
        ) : message.type === "image" ? (
          <>
            <img
              onClick={(e) => {
                setIsImageViewOpened(true);
                e.stopPropagation();
              }}
              title={formattedDate}
              className="max-w-[60%] cursor-pointer hover:brightness-[85%] transition duration-300"
              src={message.content}
              alt=""
            />
            <ImageView
              src={message.content}
              isOpened={isImageViewOpened}
              setIsOpened={setIsImageViewOpened}
            />
          </>
        ) : message.type === "file" ? (
          <div
            onClick={(e) => e.stopPropagation()}
            title={formattedDate}
            className="bg-dark-lighten flex items-center gap-2 rounded-lg overflow-hidden py-3 px-5"
          >
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
          <SpriteRenderer
            onClick={(e) => e.stopPropagation()}
            title={formattedDate}
            src={message.content}
            size={130}
          />
        ) : (
          <div
            onClick={(e) => e.stopPropagation()}
            title={formattedDate}
            className="p-3 border border-dark-lighten rounded-lg text-gray-400"
          >
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
            <button
              onClick={(e) => {
                setReplyInfo(message);
                e.stopPropagation();
              }}
              className="text-gray-500 hover:text-gray-300 transition opacity-0 group-hover:opacity-100"
            >
              <ReplyIcon />
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
    </div>
  );
};

export default LeftMessage;
