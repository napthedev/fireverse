import { FC, useState } from "react";
import { IMAGE_PROXY, THEMES } from "../../shared/constants";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import Spin from "react-cssfx-loading/src/Spin";
import { db } from "../../shared/firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";

interface CreateConversationProps {
  setIsOpened: (value: boolean) => void;
}

const CreateConversation: FC<CreateConversationProps> = ({ setIsOpened }) => {
  const { data, error, loading } = useCollectionQuery(
    "all-users",
    collection(db, "users")
  );

  const [isCreating, setIsCreating] = useState(false);

  const currentUser = useStore((state) => state.currentUser);

  const [selected, setSelected] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleToggle = (uid: string) => {
    if (selected.includes(uid)) {
      setSelected(selected.filter((item) => item !== uid));
    } else {
      setSelected([...selected, uid]);
    }
  };

  const handleCreateConversation = async () => {
    setIsCreating(true);

    const sorted = [...selected, currentUser?.uid].sort();

    const q = query(
      collection(db, "conversations"),
      where("users", "==", sorted)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const created = await addDoc(collection(db, "conversations"), {
        users: sorted,
        group:
          sorted.length > 2
            ? {
                admins: [currentUser?.uid],
                groupName: null,
                groupImage: null,
              }
            : {},
        updatedAt: serverTimestamp(),
        seen: {},
        theme: THEMES[0],
      });

      setIsCreating(false);

      setIsOpened(false);

      navigate(`/${created.id}`);
    } else {
      setIsOpened(false);

      navigate(`/${querySnapshot.docs[0].id}`);

      setIsCreating(false);
    }
  };

  return (
    <div
      onClick={() => setIsOpened(false)}
      className="fixed top-0 left-0 w-full h-full bg-[#00000080] flex justify-center items-center z-20"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-dark rounded-lg overflow-hidden w-full max-w-[500px] mx-3"
      >
        <div className="py-3 border-b border-dark-lighten flex justify-between items-center px-3">
          <div className="flex-1"></div>
          <div className="flex-1 flex justify-center items-center">
            <h1 className="text-center text-2xl whitespace-nowrap">
              New conversation
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
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spin color="#0D90F3" />
          </div>
        ) : (
          <>
            {isCreating && (
              <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-[#00000080] z-20">
                <Spin color="#0D90F3" />
              </div>
            )}
            <div className="flex flex-col items-stretch gap-2 h-96 py-2 overflow-y-auto">
              {data?.docs
                .filter((doc) => doc.data().uid !== currentUser?.uid)
                .map((doc) => (
                  <div
                    key={doc.data().uid}
                    onClick={() => handleToggle(doc.data().uid)}
                    className="flex items-center gap-2 px-5 py-2 hover:bg-dark-lighten cursor-pointer transition"
                  >
                    <input
                      className="cursor-pointer flex-shrink-0"
                      type="checkbox"
                      checked={selected.includes(doc.data().uid)}
                      readOnly
                    />
                    <img
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      src={IMAGE_PROXY(doc.data().photoURL)}
                      alt=""
                    />
                    <p>{doc.data().displayName}</p>
                  </div>
                ))}
            </div>
            <div className="flex justify-end p-3 border-t border-dark-lighten">
              <button
                disabled={selected.length === 0}
                onClick={handleCreateConversation}
                className="bg-dark-lighten py-2 px-3 rounded-lg hover:brightness-125 transition duration-300 disabled:!brightness-[80%]"
              >
                Start conversation
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateConversation;
