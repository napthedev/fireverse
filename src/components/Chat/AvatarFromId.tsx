import { DEFAULT_AVATAR, IMAGE_PROXY } from "../../shared/constants";

import { FC } from "react";
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

  if (error)
    return (
      <img
        src={DEFAULT_AVATAR}
        className="rounded-full"
        style={{ width: size, height: size }}
      />
    );

  return (
    <img
      title={data?.[0].data()?.displayName}
      style={{ width: size, height: size }}
      className="rounded-full object-cover"
      src={IMAGE_PROXY(data?.[0].data()?.photoURL)}
    ></img>
  );
};

export default AvatarFromId;
