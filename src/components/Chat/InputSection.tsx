import { ChangeEvent, FC, FormEvent, useRef, useState } from "react";
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
import Spin from "react-cssfx-loading/src/Spin";
import { formatFileName } from "../../shared/utils";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";

const InputSection: FC = () => {
  const [inputValue, setInputValue] = useState("");

  const [fileUploading, setFileUploading] = useState(false);

  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertText, setAlertText] = useState("");

  const { id: conversationId } = useParams();
  const currentUser = useStore((state) => state.currentUser);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

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

  const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image")) {
      setAlertText("The selected file is not an image");
      setIsAlertOpened(true);
      return;
    }

    const TEN_MB = 1024 * 1024 * 10;

    if (file.size > TEN_MB) {
      setAlertText("Max image size is 10MB");
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
              type: "image",
              createdAt: serverTimestamp(),
            }
          ).then(() => {
            setFileUploading(false);
          });

          updateTimestamp();
        });
      })
      .catch(() => setFileUploading(false));
  };

  const updateTimestamp = () => {
    updateDoc(doc(db, "conversations", conversationId as string), {
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <>
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
          onChange={handleImageInputChange}
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
          {fileUploading ? (
            <Spin width="24px" height="24px" color="#0D90F3" />
          ) : (
            <button className="flex-shrink-0 text-2xl text-primary flex items-center">
              <i className="bx bxs-send"></i>
            </button>
          )}
        </form>
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
