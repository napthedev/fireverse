import { ChangeEvent, FC, Suspense, lazy, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../shared/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import Alert from "../Alert";
import ClickAwayListener from "../ClickAwayListener";
import { EMOJI_REPLACEMENT } from "../../shared/constants";
import Spin from "react-cssfx-loading/src/Spin";
import StickerPicker from "./StickerPicker";
import { formatFileName } from "../../shared/utils";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";

const Picker = lazy(() => import("./EmojiPicker"));

interface InputSectionProps {
  disabled: boolean;
}

const InputSection: FC<InputSectionProps> = ({ disabled }) => {
  const [inputValue, setInputValue] = useState("");

  const [fileUploading, setFileUploading] = useState(false);

  const [isStickerPickerOpened, setIsStickerPickerOpened] = useState(false);
  const [isIconPickerOpened, setIsIconPickerOpened] = useState(false);

  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertText, setAlertText] = useState("");

  const { id: conversationId } = useParams();
  const currentUser = useStore((state) => state.currentUser);

  const textInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateTimestamp = () => {
    updateDoc(doc(db, "conversations", conversationId as string), {
      updatedAt: serverTimestamp(),
    });
  };

  const submitMessage = () => {
    if (fileUploading) return;

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

    updateTimestamp();
  };

  const sendSticker = (url: string) => {
    addDoc(
      collection(db, "conversations", conversationId as string, "messages"),
      {
        sender: currentUser?.uid,
        content: url,
        type: "sticker",
        createdAt: serverTimestamp(),
      }
    );

    updateTimestamp();
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const TWENTY_MB = 1024 * 1024 * 20;

    if (file.size > TWENTY_MB) {
      setAlertText("Max file size is 20MB");
      setIsAlertOpened(true);
      return;
    }

    setFileUploading(true);

    const fileReference = ref(storage, formatFileName(file.name));

    uploadBytes(fileReference, file)
      .then(() => {
        getDownloadURL(fileReference).then((url) => {
          addDoc(
            collection(
              db,
              "conversations",
              conversationId as string,
              "messages"
            ),
            {
              sender: currentUser?.uid,
              content: url,
              type: file.name.startsWith("image") ? "image" : "file",
              file: {
                name: file.name,
                size: file.size,
              },
              createdAt: serverTimestamp(),
            }
          );

          setFileUploading(false);
          updateTimestamp();
        });
      })
      .catch(() => setFileUploading(false));
  };

  const addIconToInput = (value: string) => {
    const start = textInputRef.current?.selectionStart as number;
    const end = textInputRef.current?.selectionEnd as number;
    const splitted = inputValue.split("");
    splitted.splice(start, end - start, value);
    setInputValue(splitted.join(""));
  };

  const handleReplaceEmoji = (e: any) => {
    if (e.key === " " || e.key === "Enter") {
      if (e.target.selectionStart !== e.target.selectionEnd) return;

      const lastWord = inputValue
        .slice(0, e.target.selectionStart)
        .split(" ")
        .slice(-1)[0];

      if (lastWord.length === 0) return;

      Object.entries(EMOJI_REPLACEMENT).map(([key, value]) => {
        value.forEach((item) => {
          if (item === lastWord) {
            const splitted = inputValue.split("");
            splitted.splice(
              e.target.selectionStart - lastWord.length,
              lastWord.length,
              key
            );
            setInputValue(splitted.join(""));
          }
        });
      });
    }
  };

  return (
    <>
      <div
        className={`flex items-stretch h-16 px-4 gap-1 border-t border-dark-lighten ${
          disabled ? "pointer-events-none select-none" : ""
        }`}
      >
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
          onChange={handleFileInputChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 text-2xl text-primary flex items-center"
        >
          <i className="bx bx-link-alt"></i>
        </button>
        <input
          ref={fileInputRef}
          hidden
          className="hidden"
          type="file"
          onChange={handleFileInputChange}
        />
        <div className="flex-shrink-0 flex items-center relative">
          {isStickerPickerOpened && (
            <StickerPicker
              setIsOpened={setIsStickerPickerOpened}
              onSelect={sendSticker}
            />
          )}

          <button
            onClick={() => setIsStickerPickerOpened(true)}
            className="flex items-center"
          >
            <svg
              className="w-[26px] h-[22px] object-contain text-primary"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
            >
              <g>
                <path
                  d="M414.773,44.763H97.227C43.616,44.763,0,88.38,0,141.992v228.016c0,53.612,43.616,97.229,97.227,97.229h317.545
			c53.612,0,97.227-43.617,97.227-97.229V141.992C512,88.38,468.384,44.763,414.773,44.763z M214.73,325.581
			c-16.078,19.633-37.726,30.445-60.958,30.445c-23.232,0-44.88-10.812-60.958-30.445c-15.335-18.725-23.78-43.437-23.78-69.58
			c0-26.144,8.446-50.855,23.78-69.58c16.078-19.633,37.726-30.446,60.958-30.446c24.375,0,47.563,12.336,63.614,33.842
			c5.156,6.909,3.736,16.69-3.173,21.845c-6.91,5.156-16.689,3.736-21.846-3.173c-10.25-13.733-23.956-21.296-38.596-21.296
			c-29.51,0-53.519,30.867-53.519,68.807s24.008,68.807,53.519,68.807c25.335,0,46.616-22.752,52.13-53.198h-21.388
			c-8.621,0-15.609-6.989-15.609-15.609c0-8.621,6.989-15.609,15.609-15.609h38.386c8.621,0,15.609,6.989,15.609,15.609
			C238.51,282.143,230.064,306.855,214.73,325.581z M302.102,340.416c0,8.62-6.989,15.609-15.609,15.609
			c-8.621,0-15.609-6.989-15.609-15.609V171.583c0-8.621,6.989-15.609,15.609-15.609c8.62,0,15.609,6.989,15.609,15.609V340.416z
			 M427.356,220.45c8.62,0,15.609,6.989,15.609,15.609c0,8.62-6.989,15.609-15.609,15.609h-61.661v88.747
			c0,8.621-6.989,15.609-15.609,15.609c-8.62,0-15.609-6.989-15.609-15.609V171.583c0-8.621,6.989-15.609,15.609-15.609h77.27
			c8.62,0,15.609,6.989,15.609,15.609c0,8.62-6.989,15.609-15.609,15.609h-61.661v33.257H427.356z"
                />
              </g>
            </svg>
          </button>
        </div>

        <div className="flex-grow flex items-center relative">
          <input
            ref={textInputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={handleReplaceEmoji}
            onKeyPress={(e) => {
              if (e.key === "Enter") submitMessage();
            }}
            className="w-full h-9 pl-3 pr-10 bg-dark-lighten outline-none rounded-full"
            type="text"
            placeholder="Message..."
            autoFocus
          />
          <button
            type="button"
            onClick={() => setIsIconPickerOpened(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <i className="bx bxs-smile text-primary text-2xl"></i>
          </button>

          {isIconPickerOpened && (
            <ClickAwayListener onClickAway={() => setIsIconPickerOpened(false)}>
              {(ref) => (
                <div ref={ref} className="absolute bottom-full right-0">
                  <Suspense
                    fallback={
                      <div className="w-[348px] h-[357px] flex justify-center items-center">
                        <Spin />
                      </div>
                    }
                  >
                    <Picker
                      onSelect={(emoji: any) => addIconToInput(emoji.native)}
                    />
                  </Suspense>
                </div>
              )}
            </ClickAwayListener>
          )}
        </div>
        {fileUploading ? (
          <Spin width="24px" height="24px" color="#0D90F3" />
        ) : (
          <button
            onClick={() => submitMessage()}
            className="flex-shrink-0 text-2xl text-primary flex items-center"
          >
            <i className="bx bxs-send"></i>
          </button>
        )}
      </div>

      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text={alertText}
        isError
      />
    </>
  );
};

export default InputSection;
