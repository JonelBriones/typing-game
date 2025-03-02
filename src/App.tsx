import { useEffect, useState } from "react";
import "./App.scss";
import Game from "./components/Game/Game";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";

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
  }, [toggleDarkMode]);

  return (
    <BrowserRouter>
      <div id="wrapper" className={`app ${toggleDarkMode ? "light" : "dark"}`}>
        <nav className="navbar">
          <div className="nav-left">left {toggleDarkMode}</div>
          <div className="nav-right">
            <button onClick={() => setToggleDarkMode(!toggleDarkMode)}>
              {" "}
              {toggleDarkMode ? (
                <MdDarkMode size={"1.2rem"} />
              ) : (
                <IoSunnyOutline size={"1.2rem"} />
              )}
            </button>
            <button>
              <FaUser size={"1.2rem"} />
            </button>
          </div>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Game />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
