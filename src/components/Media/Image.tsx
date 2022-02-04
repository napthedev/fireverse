import { FC, useState } from "react";
import { collection, orderBy, query, where } from "firebase/firestore";

import ImageView from "../ImageView";
import Spin from "react-cssfx-loading/src/Spin";
import { db } from "../../shared/firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useParams } from "react-router-dom";

const ImageItem: FC<{ src: string }> = ({ src }) => {
  const [isImageViewOpened, setIsImageViewOpened] = useState(false);

  return (
    <>
      <img
        onClick={() => setIsImageViewOpened(true)}
        className="w-[100px] h-[100px] object-cover hover:brightness-75 transition duration-300 cursor-pointer"
        src={src}
        alt=""
      />
      <ImageView
        src={src}
        isOpened={isImageViewOpened}
        setIsOpened={setIsImageViewOpened}
      />
    </>
  );
};

const Image: FC = () => {
  const { id: conversationId } = useParams();

  const { data, loading, error } = useCollectionQuery(
    `images-${conversationId}`,
    query(
      collection(db, "conversations", conversationId as string, "messages"),
      where("type", "==", "image"),
      orderBy("createdAt", "desc")
    )
  );

  if (loading || error)
    return (
      <div className="h-80 flex justify-center items-center">
        <Spin />
      </div>
    );

  if (data?.empty)
    return (
      <div className="h-80 py-3">
        <p className="text-center">No image found</p>
      </div>
    );

  return (
    <div className="h-80 flex flex-wrap content-start gap-4 overflow-y-auto overflow-x-hidden p-4">
      {data?.docs.map((image) => (
        <ImageItem key={image.id} src={image.data().content} />
      ))}
    </div>
  );
};

export default Image;
