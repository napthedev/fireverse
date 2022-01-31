import { FC, FormEvent, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../../shared/firebase";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";

const InputSection: FC = () => {
  const [inputValue, setInputValue] = useState("");

  const { id: conversationId } = useParams();
  const currentUser = useStore((state) => state.currentUser);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setInputValue("");

    addDoc(
      collection(db, "conversations", conversationId as string, "messages"),
      {
        sender: currentUser?.uid,
        content: inputValue.trim(),
        type: "text",
        createdAt: serverTimestamp(),
      }
    );
  };

  return (
    <div className="flex items-stretch h-16 px-4 gap-1 border-t border-dark-lighten">
      <button
        onClick={() => imageInputRef.current?.click()}
        className="flex-shrink-0 text-2xl text-primary flex items-center"
      >
        <i className="bx bxs-image-add"></i>
      </button>
      <input
        ref={imageInputRef}
        hidden
        className="hidden"
        type="file"
        accept="image/*"
      />
      <button className="flex-shrink-0 text-2xl text-primary flex items-center">
        <i className="bx bx-link-alt"></i>
      </button>
      <button className="flex-shrink-0 flex items-center">
        <img className="w-[22px] h-[22px] mx-1" src="/gif.svg" alt="" />
      </button>
      <form
        onSubmit={handleFormSubmit}
        className="flex-grow flex items-center gap-1"
      >
        <div className="flex-grow flex items-center">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-9 px-3 bg-dark-lighten outline-none rounded-full"
            type="text"
            placeholder="Message..."
          />
        </div>
        <button className="flex-shrink-0 text-2xl text-primary flex items-center">
          <i className="bx bxs-send"></i>
        </button>
      </form>
    </div>
  );
};

export default InputSection;
