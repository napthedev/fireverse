import { FC } from "react";
import SideBar from "../components/Home/SideBar";

const Home: FC = () => {
  return (
    <div className="flex">
      <SideBar />

      <div className="flex-grow flex flex-col items-center justify-center gap-3">
        <h1>Select a conversation to start chatting</h1>
      </div>
    </div>
  );
};

export default Home;
