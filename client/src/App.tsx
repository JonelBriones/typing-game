import { useEffect, useState } from "react";
import styles from "../App.module.scss";
import "./index.scss";
import Game from "./components/Game/Game";
import { FaRegKeyboard } from "react-icons/fa";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import Leaderboard from "./components/Leaderboard/Leaderboard";

function App() {
  const preferenceTheme = () => {
    const preference = localStorage.getItem("theme");
    if (preference) return preference === "dark";
    return window.matchMedia("(prefers-color-scheme:dark)").matches;
  };
  const [toggleDarkMode, setToggleDarkMode] = useState(preferenceTheme);

  useEffect(() => {
    if (toggleDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    console.log(localStorage.getItem("theme"));
  }, [toggleDarkMode]);

  return (
    <BrowserRouter>
      <div id="wrapper" className={styles.app}>
        <nav className={styles.navbar}>
          <div className={styles.leaderboard}>
            <a href="/leaderboard">Leaderboard</a>

            <a href="/">
              <FaRegKeyboard size={"1.25rem"} />
            </a>
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
            <button className={styles.navbutton}>
              <FaUser size={"1.2rem"} />
            </button>
          </div>
        </nav>
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<Game />} />

            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
