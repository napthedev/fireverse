import { FC } from "react";
import SideBar from "../components/Home/SideBar";
import { useStore } from "../store";

const Home: FC = () => {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div className="flex">
      <SideBar />

      <div className="flex-grow">Right</div>
    </div>
  );
};

export default Home;
