import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Loader from "./components/loader/loader";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserContextProvider } from "./context/userContext";
import { getUser as getUserFromStorage, login } from "./services/localStorage";
import { getUser, loginUser } from "./services/http";
import "./App.css";
import { useEffect, useState } from "react";
import { addUser } from "./services/socket";

function App() {
  const [user, setUser] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState("news");

  useEffect(() => {
    const user = getUserFromStorage();
    const fetchUser = async () => {
      const updatedUser = await getUser(user._id);
      setUser(updatedUser);
      setUserLoggedIn(true);
      setLoading(false);
    };

    if (user) {
      fetchUser();
      addUser(user._id);
    } else setLoading(false);
  }, []);

  const setCurrentUser = async (user, loginRequest) => {
    if (loginRequest) user = await loginUser(user);
    setUser(user);
    login(user);
    addUser(user._id);
    setUserLoggedIn(true);
  };

  if (loading) return <Loader style={{ marginTop: "5rem" }} />;

  return (
    <UserContextProvider value={{ user, setUser: setCurrentUser }}>
      <Router class="app">
        <Routes>
          <Route
            path="/"
            element={
              userLoggedIn ? (
                <Home feed={feed} setFeed={setFeed} />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/login"
            element={userLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={userLoggedIn ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/profile/:userId"
            element={<Profile feed={feed} setFeed={setFeed} />}
          />
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
