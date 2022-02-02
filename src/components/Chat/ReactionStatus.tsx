import { FC, useState } from "react";
import { IMAGE_PROXY, REACTIONS_UI } from "../../shared/constants";

import { MessageItem } from "../../shared/types";
import Spin from "react-cssfx-loading/src/Spin";
import { useUsersInfo } from "../../hooks/useUsersInfo";

interface ReactionStatusProps {
  position: "left" | "right" | "left-tab";
  message: MessageItem;
}

const ReactionStatus: FC<ReactionStatusProps> = ({ message, position }) => {
  const {
    data: usersInfo,
    loading,
    error,
  } = useUsersInfo(Object.keys(message.reactions || {}));

  const [isReactionStatusOpened, setIsReactionStatusOpened] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsReactionStatusOpened(true)}
        className={`absolute top-full -translate-y-1/2 bg-dark-lighten px-2 rounded-lg py-[1px] text-sm flex items-center gap-[2px] border border-dark cursor-pointer ${
          position === "right"
            ? "right-8"
            : position === "left-tab"
            ? "left-[70px]"
            : "left-8"
        }`}
      >
        {Object.entries(
          Object.entries(message.reactions).reduce((acc, [key, value]) => {
            if (value) acc[value] = (acc[value] || 0) + 1;
            return acc;
          }, {} as { [key: number]: number })
        )
          .sort(([key1, value1], [key2, value2]) => value1 - value2)
          .slice(0, 3)
          .map(([key, value]) => (
            <img
              className="w-3 h-3"
              src={Object.entries(REACTIONS_UI)[Number(key) - 1][1].icon}
              alt=""
            />
          ))}

        <span>
          {
            Object.entries(message.reactions).filter(([key, value]) => value)
              .length
          }
        </span>
      </div>

      {isReactionStatusOpened && (
        <div
          onClick={() => setIsReactionStatusOpened(false)}
          className="fixed top-0 left-0 w-full h-full bg-[#00000080] flex justify-center items-center z-20 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-dark rounded-lg h-96 w-screen max-w-[400px] flex flex-col"
          >
            <div className="flex p-4 items-center border-b border-dark-lighten flex-shrink-0">
              <div className="flex-1"></div>
              <div className="flex-1">
                <h1 className="text-2xl text-center">Reactions</h1>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setIsReactionStatusOpened(false)}
                  className="h-8 w-8 rounded-full bg-dark-lighten flex items-center justify-center hover:brightness-125 transition duration-300"
                >
                  <i className="bx bx-x text-3xl"></i>
                </button>
              </div>
            </div>

            {loading || error ? (
              <div className="flex-grow flex justify-center items-center">
                <Spin />
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto overflow-x-hidden">
                {Object.entries(message.reactions)
                  .filter(([key, value]) => value)
                  .map(([key, value]) => (
                    <div className="flex justify-between px-5 py-2 items-center">
                      <div className="flex gap-3 items-center">
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={IMAGE_PROXY(
                            usersInfo?.find((user) => user.id === key)?.data()
                              ?.photoURL
                          )}
                          alt=""
                        />
                        <p>
                          {
                            usersInfo?.find((user) => user.id === key)?.data()
                              ?.displayName
                          }
                        </p>
                      </div>

                      <img
                        className="w-5 h-5"
                        src={Object.values(REACTIONS_UI)[value - 1].icon}
                        alt=""
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReactionStatus;
