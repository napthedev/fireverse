import { FC } from "react";
import { MessageItem } from "../../shared/types";
import { REACTIONS_UI } from "../../shared/constants";

interface ReactionStatusProps {
  position: "left" | "right";
  message: MessageItem;
}

const ReactionStatus: FC<ReactionStatusProps> = ({ message, position }) => {
  return (
    <div
      className={`absolute top-full -translate-y-1/2 bg-dark-lighten px-2 rounded-lg py-[1px] text-sm flex items-center gap-[2px] border border-dark ${
        position === "right" ? "right-8" : "left-[70px]"
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
  );
};

export default ReactionStatus;
