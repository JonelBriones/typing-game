import { useContext, useEffect, useState } from "react";
import styles from "../App.module.scss";
import "./index.scss";
import Game from "./components/Game/Game";
import { FaRegKeyboard } from "react-icons/fa";

import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import { useAuthContext } from "./AuthProvider";
import Login from "./dashboard/login/Login";
import Signup from "./dashboard/signup/Signup";

function App() {
  const preferenceTheme = () => {
    const preference = localStorage.getItem("theme");
    if (preference) return preference === "dark";
    return window.matchMedia("(prefers-color-scheme:dark)").matches;
  };
  const [toggleDarkMode, setToggleDarkMode] = useState(preferenceTheme());
  const { setSession, setToken, session } = useAuthContext() as any;
  const navigate = useNavigate();
  useEffect(() => {
    console.log("run");
    if (toggleDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    console.log(localStorage.getItem("theme"));
  }, [toggleDarkMode]);
  async function logout() {
    const res = await fetch("http://localhost:2222/api/user/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!res) {
      console.log("error");
      throw new Error("go away");
    }
    const result = await res.json();
    console.log("logged out", result);
    setSession(null);
    setToken(null);
    navigate("/");
  }

  return (
    <div id="wrapper" className={styles.app}>
      <nav className={styles.navbar}>
        <div className={styles.leaderboard}>
          <Link to="/leaderboard">Leaderboard</Link>

          <Link to="/">
            <FaRegKeyboard size={"1.25rem"} />
          </Link>

          <Link to="/signup">signup</Link>
        </div>
        <div className={`${styles.navright}`}>
          <button
            onClick={() => setToggleDarkMode(!toggleDarkMode)}
            className={`${styles.navbutton}`}
          >
            {" "}
            {toggleDarkMode ? (
              <IoSunnyOutline size={"1.2rem"} />
            ) : (
              <MdDarkMode size={"1.2rem"} />
            )}
          </button>
          {session && <button onClick={() => logout()}>logout</button>}
          <button className={styles.navbutton}>
            {session ? (
              <FaUser size={"1.2rem"} />
            ) : (
              <Link to="/login">login</Link>
            )}
          </button>
        </div>
      </nav>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
