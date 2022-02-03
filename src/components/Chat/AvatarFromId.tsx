import { FC } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import Skeleton from "../Skeleton";
import { useUsersInfo } from "../../hooks/useUsersInfo";

interface AvatarFromIdProps {
  uid: string;
  size?: number;
}

const AvatarFromId: FC<AvatarFromIdProps> = ({ uid, size = 30 }) => {
  const { data, loading, error } = useUsersInfo([uid]);

  if (loading)
    return (
      <Skeleton
        className="rounded-full"
        style={{ width: size, height: size }}
      ></Skeleton>
    );

  return (
    <img
      title={data?.[0].data()?.displayName}
      style={{ width: size, height: size }}
      className="object-cover rounded-full"
      src={IMAGE_PROXY(data?.[0].data()?.photoURL)}
    ></img>
  );
};

export default AvatarFromId;
