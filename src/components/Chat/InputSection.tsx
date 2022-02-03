import {
  ChangeEvent,
  ClipboardEventHandler,
  FC,
  FormEvent,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
} from "react";
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
import ReplyIcon from "./ReplyIcon";
import Spin from "react-cssfx-loading/src/Spin";
import StickerPicker from "./StickerPicker";
import { formatFileName } from "../../shared/utils";
import { useParams } from "react-router-dom";
import { useStore } from "../../store";

const Picker = lazy(() => import("./EmojiPicker"));

interface InputSectionProps {
  disabled: boolean;
  setInputSectionOffset?: (value: number) => void;
  replyInfo?: any;
  setReplyInfo?: (value: any) => void;
}

const InputSection: FC<InputSectionProps> = ({
  disabled,
  setInputSectionOffset,
  replyInfo,
  setReplyInfo,
}) => {
  const [inputValue, setInputValue] = useState("");

  const [fileUploading, setFileUploading] = useState(false);

  const [previewFiles, setPreviewFiles] = useState<string[]>([]);

  const [isStickerPickerOpened, setIsStickerPickerOpened] = useState(false);
  const [isIconPickerOpened, setIsIconPickerOpened] = useState(false);

  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertText, setAlertText] = useState("");

  const { id: conversationId } = useParams();
  const currentUser = useStore((state) => state.currentUser);

  const textInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileDragging, setFileDragging] = useState(false);

  const updateTimestamp = () => {
    updateDoc(doc(db, "conversations", conversationId as string), {
      updatedAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    const handler = () => {
      textInputRef.current?.focus();
    };
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  useEffect(() => {
    textInputRef.current?.focus();
  }, [conversationId]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (previewFiles.length > 0) {
      setPreviewFiles([]);
      for (let i = 0; i < previewFiles.length; i++) {
        const url = previewFiles[i];
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], "image.png", {
          type: res.headers.get("content-type") as string,
        });
        await uploadFile(file);
      }
    } else {
      if (fileUploading) return;
    }

    if (!inputValue.trim()) return;

    setInputValue("");

    let replacedInputValue = ` ${inputValue} `;

    Object.entries(EMOJI_REPLACEMENT).map(([key, value]) => {
      value.forEach((item) => {
        replacedInputValue = replacedInputValue
          .split(` ${item} `)
          .join(` ${key} `);
      });
    });

    setReplyInfo && setReplyInfo(null);

    addDoc(
      collection(db, "conversations", conversationId as string, "messages"),
      {
        sender: currentUser?.uid,
        content: replacedInputValue.trim(),
        type: "text",
        createdAt: serverTimestamp(),
        replyTo: replyInfo?.id || null,
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

  const uploadFile = async (file: File) => {
    try {
      const TWENTY_MB = 1024 * 1024 * 20;

      if (file.size > TWENTY_MB) {
        setAlertText("Max file size is 20MB");
        setIsAlertOpened(true);
        return;
      }

      setFileUploading(true);

      const fileReference = ref(storage, formatFileName(file.name));

      await uploadBytes(fileReference, file);

      const downloadURL = await getDownloadURL(fileReference);

      addDoc(
        collection(db, "conversations", conversationId as string, "messages"),
        {
          sender: currentUser?.uid,
          content: downloadURL,
          type: file.type.startsWith("image") ? "image" : "file",
          file: file.type.startsWith("image")
            ? null
            : {
                name: file.name,
                size: file.size,
              },
          createdAt: serverTimestamp(),
        }
      );

      setFileUploading(false);
      updateTimestamp();
    } catch (error) {
      console.log(error);
      setFileUploading(false);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    uploadFile(file);
  };

  const addIconToInput = (value: string) => {
    const start = textInputRef.current?.selectionStart as number;
    const end = textInputRef.current?.selectionEnd as number;
    const splitted = inputValue.split("");
    splitted.splice(start, end - start, value);
    setInputValue(splitted.join(""));
  };

  const handleReplaceEmoji = (e: any) => {
    if (e.key === " ") {
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

  useEffect(() => {
    if (!setInputSectionOffset) return;
    if (previewFiles.length > 0) return setInputSectionOffset(128);

    if (!!replyInfo) return setInputSectionOffset(76);

    setInputSectionOffset(0);
  }, [previewFiles.length, replyInfo]);

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
    const file = e?.clipboardData?.files?.[0];
    if (!file || !file.type.startsWith("image")) return;

    const url = URL.createObjectURL(file);

    setPreviewFiles([...previewFiles, url]);
  };

  useEffect(() => {
    const dragBlurHandler = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setFileDragging(false);
    };

    const dragFocusHandler = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setFileDragging(true);
    };

    const dropFileHandler = async (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      setFileDragging(false);

      let items = e.dataTransfer.items;
      let files = e.dataTransfer.files;

      let selectedFiles = [];

      for (let i = 0, item; (item = items[i]); ++i) {
        let entry = item.webkitGetAsEntry();
        if (entry.isFile) {
          selectedFiles.push(files[i]);
        }
      }

      for (let i = 0; i < selectedFiles.length; i++) {
        await uploadFile(selectedFiles[i]);
      }
    };

    addEventListener("dragenter", dragFocusHandler);
    addEventListener("dragover", dragFocusHandler);
    addEventListener("dragleave", dragBlurHandler);
    addEventListener("drop", dropFileHandler);

    return () => {
      removeEventListener("dragenter", dragFocusHandler);
      removeEventListener("dragover", dragFocusHandler);
      removeEventListener("dragleave", dragBlurHandler);
      removeEventListener("drop", dropFileHandler);
    };
  }, []);

  return (
    <>
      {fileDragging && (
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm z-20 flex justify-center items-center pointer-events-none select-none">
          <h1 className="text-3xl">Drop file to send</h1>
        </div>
      )}
      {previewFiles.length > 0 && (
        <div className="h-32 border-t border-dark-lighten flex items-center gap-2 px-4">
          {previewFiles.map((preview) => (
            <div key={preview} className="relative">
              <img className="w-28 h-28 object-cover" src={preview} alt="" />
              <button
                onClick={() =>
                  setPreviewFiles(
                    previewFiles.filter((item) => item !== preview)
                  )
                }
                className="absolute top-1 right-1 h-4 w-4 rounded-full flex items-center justify-center bg-gray-100"
              >
                <i className="bx bx-x text-dark text-lg"></i>
              </button>
            </div>
          ))}
        </div>
      )}
      {previewFiles.length === 0 && !!replyInfo && (
        <div className="h-[76px] border-t border-dark-lighten p-4 flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ReplyIcon />
              <p>
                Replying
                {currentUser?.uid === replyInfo.sender ? " to yourself" : ""}
              </p>
            </div>
            {replyInfo.type === "text" ? (
              <p className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[calc(100vw-65px)] md:max-w-[calc(100vw-420px)]">
                {replyInfo.content}
              </p>
            ) : replyInfo.type === "image" ? (
              "An image"
            ) : replyInfo.type === "file" ? (
              "A file"
            ) : replyInfo.type === "sticker" ? (
              "A sticker"
            ) : (
              "Message has been removed"
            )}
          </div>

          <button onClick={() => setReplyInfo && setReplyInfo(null)}>
            <i className="bx bx-x text-3xl"></i>
          </button>
        </div>
      )}
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

        <form
          onSubmit={handleFormSubmit}
          className="flex-grow flex items-stretch gap-1"
        >
          <div className="flex-grow flex items-center relative">
            <input
              maxLength={1000}
              disabled={disabled}
              ref={textInputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={handleReplaceEmoji}
              onPaste={handlePaste}
              className="w-full h-9 pl-3 pr-10 bg-dark-lighten outline-none rounded-full"
              type="text"
              placeholder="Message..."
            />
            <button
              type="button"
              onClick={() => setIsIconPickerOpened(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <i className="bx bxs-smile text-primary text-2xl"></i>
            </button>

            {isIconPickerOpened && (
              <ClickAwayListener
                onClickAway={() => setIsIconPickerOpened(false)}
              >
                {(ref) => (
                  <div ref={ref} className="absolute bottom-full right-0">
                    <Suspense
                      fallback={
                        <div className="w-[348px] h-[357px] bg-[#222222] border-[#555453] rounded-lg border-2 flex justify-center items-center">
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
            <div className="flex items-center ml-1">
              <Spin width="24px" height="24px" color="#0D90F3" />
            </div>
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
