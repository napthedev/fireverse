import { ChangeEvent, FC, FormEvent, useRef, useState } from "react";
import { db, storage } from "../../shared/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import Alert from "../Alert";
import { ConversationInfo } from "../../shared/types";
import { formatFileName } from "../../shared/utils";
import { useParams } from "react-router-dom";

interface ConversationConfigProps {
  conversation: ConversationInfo;
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

const ConversationSettings: FC<ConversationConfigProps> = ({
  conversation,
  isOpened,
  setIsOpened,
}) => {
  const { id: conversationId } = useParams();

  const [isChangeChatNameOpened, setIsChangeChatNameOpened] = useState(false);
  const [chatNameInputValue, setChatNameInputValue] = useState(
    conversation?.group?.groupName || ""
  );

  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertText, setAlertText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!chatNameInputValue.trim()) return;
    setIsOpened(false);
    updateDoc(doc(db, "conversations", conversationId as string), {
      "group.groupName": chatNameInputValue.trim(),
    });
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image")) {
      setAlertText("File is not an image");
      setIsAlertOpened(true);
      return;
    }

    const FIVE_MB = 1024 * 1024 * 5;

    if (file.size > FIVE_MB) {
      setAlertText("Max image size is 20MB");
      setIsAlertOpened(true);
      return;
    }

    setIsOpened(false);

    const fileReference = ref(storage, formatFileName(file.name));

    await uploadBytes(fileReference, file);

    const downloadURL = await getDownloadURL(fileReference);

    updateDoc(doc(db, "conversations", conversationId as string), {
      "group.groupImage": downloadURL,
    });
  };

  return (
    <div
      onClick={() => setIsOpened(false)}
      className={`fixed top-0 left-0 w-full h-full bg-[#00000080] z-20 flex justify-center items-center transition-all duration-300 ${
        isOpened ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[500px] mx-2 bg-dark rounded-lg"
      >
        <div className="py-3 border-b border-dark-lighten flex justify-between items-center px-3">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-center text-2xl whitespace-nowrap">
              Conversation settings
            </h1>
          </div>
          <div className="flex-1 flex justify-end items-center">
            <button
              onClick={() => setIsOpened(false)}
              className="w-8 h-8 bg-dark-lighten rounded-full flex justify-center items-center"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-stretch p-3">
          {conversation.users.length > 2 && (
            <>
              <button
                onClick={() => setIsChangeChatNameOpened((prev) => !prev)}
                className="flex justify-between items-center px-3 py-2 gap-3 rounded-lg hover:brightness-125 bg-dark transition duration-300"
              >
                <div className="flex items-center gap-3">
                  <i className="bx bx-edit-alt text-2xl"></i>
                  <span>Change chat name</span>
                </div>

                <i
                  className={`bx bx-chevron-down text-3xl ${
                    isChangeChatNameOpened ? "rotate-180" : ""
                  }`}
                ></i>
              </button>
              {isChangeChatNameOpened && (
                <form onSubmit={handleFormSubmit} className="flex gap-3 my-2">
                  <div className="flex-grow">
                    <input
                      value={chatNameInputValue}
                      onChange={(e) => setChatNameInputValue(e.target.value)}
                      className="w-full h-full outline-none border border-dark-lighten focus:border-gray-500 transition duration-300 p-2 rounded-lg bg-dark"
                      type="text"
                      placeholder="Chat name"
                    />
                  </div>
                  <button className="flex-shrink-0 bg-primary px-3 rounded hover:brightness-110 transition duration-300">
                    Change
                  </button>
                </form>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-3 py-2 gap-3 rounded-lg hover:brightness-125 bg-dark transition duration-300"
              >
                <i className="bx bx-image-alt text-2xl"></i>
                <span>Change group photo</span>
              </button>

              <input
                hidden
                className="hidden"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
              />

              <Alert
                isOpened={isAlertOpened}
                setIsOpened={setIsAlertOpened}
                text={alertText}
                isError
              />
            </>
          )}
          <button className="flex items-center px-3 py-2 gap-3 rounded-lg hover:brightness-125 bg-dark transition duration-300">
            <i className="bx bx-palette text-2xl"></i>
            <span>Change theme</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationSettings;
