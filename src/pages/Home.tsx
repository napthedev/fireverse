import { FC } from "react";
import SideBar from "../components/Home/SideBar";

const Home: FC = () => {
  return (
    <div className="flex">
      <SideBar />

      <div className="flex-grow">Select a conversation</div>
    </div>
  );
};

export default Home;
