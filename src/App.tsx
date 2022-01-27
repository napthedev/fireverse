import { FC, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import BarWave from "react-cssfx-loading/src/BarWave";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./pages/SignIn";
import { auth } from "./shared/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useStore } from "./store";

const App: FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else setCurrentUser(null);
    });
  }, []);

  if (typeof currentUser === "undefined")
    return (
      <div className="min-h-screen flex justify-center items-center">
        <BarWave />
      </div>
    );

  return (
    <Routes>
      <Route
        index
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="sign-in" element={<SignIn />} />
    </Routes>
  );
};

export default App;
