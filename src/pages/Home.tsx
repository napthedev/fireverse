import { FC } from "react";
import { useStore } from "../store";

const Home: FC = () => {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div>
      <pre>{JSON.stringify(currentUser, null, 2)}</pre>
    </div>
  );
};

export default Home;
