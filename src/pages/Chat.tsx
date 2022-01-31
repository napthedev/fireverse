import { FC } from "react";
import SideBar from "../components/Home/SideBar";
import { useParams } from "react-router-dom";

const Chat: FC = () => {
  const { id } = useParams();

  return (
    <div className="flex">
      <SideBar />

      <div className="flex-grow">{id}</div>
    </div>
  );
};

export default Chat;
