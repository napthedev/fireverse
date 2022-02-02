import { FC, Ref } from "react";
import { doc, updateDoc } from "firebase/firestore";

import { REACTIONS_UI } from "../../shared/constants";
import { db } from "../../shared/firebase";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";

interface ReactionPopupProps {
  position: "left" | "right";
  forwardedRef: Ref<HTMLDivElement>;
  setIsOpened: (value: boolean) => void;
  messageId: string;
  currentReaction: number;
}

const ReactionPopup: FC<ReactionPopupProps> = ({
  position,
  forwardedRef,
  setIsOpened,
  messageId,
  currentReaction,
}) => {
  const { id: conversationId } = useParams();

  const currentUser = useStore((state) => state.currentUser);

  const updateReaction = (value: number) => {
    updateDoc(
      doc(db, "conversations", conversationId as string, "messages", messageId),
      {
        [`reactions.${currentUser?.uid}`]: value,
      }
    );
  };

  return (
    <div
      ref={forwardedRef}
      className={`absolute bottom-[calc(100%+5px)] flex gap-1 bg-dark-lighten rounded-full shadow p-[6px] z-[1] animate-fade-in ${
        position === "left" ? "left-8" : "right-8"
      }`}
    >
      {Object.entries(REACTIONS_UI).map(([key, value], index) => (
        <div
          key={key}
          className={`${
            index + 1 === currentReaction
              ? "relative after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:w-[5px] after:h-[5px] after:rounded-full after:bg-primary"
              : ""
          }`}
        >
          <img
            onClick={() => {
              if (index + 1 === currentReaction) updateReaction(0);
              else updateReaction(index + 1);
              setIsOpened(false);
            }}
            title={key}
            className={`w-7 h-7 cursor-pointer hover:scale-[115%] origin-bottom transition duration-300`}
            src={value.gif}
            alt=""
          />
        </div>
      ))}
    </div>
  );
};

export default ReactionPopup;
