import { useEffect, useState } from "react";
// import styles from "../App.module.scss";
import { FaRegKeyboard } from "react-icons/fa";
import styles from "./Navbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import { useAuthContext } from "../../AuthProvider";
import { FaTrophy } from "react-icons/fa";
const Navbar = () => {
  const { setSession, setToken, session } = useAuthContext() as any;
  const navigate = useNavigate();
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
  const preferenceTheme = () => {
    const preference = localStorage.getItem("theme");
    if (preference) return preference === "dark";
    return window.matchMedia("(prefers-color-scheme:dark)").matches;
  };
  const [toggleDarkMode, setToggleDarkMode] = useState(preferenceTheme());

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

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/">CloudType</Link>
        <Link to="/leaderboard">
          <FaTrophy size={"1.25rem"} />
        </Link>
        <Link to="/">
          <FaRegKeyboard size={"1.25rem"} />
        </Link>
      </div>
      <div>
        <button
          onClick={() => setToggleDarkMode(!toggleDarkMode)}
          className={`${styles.navbutton}`}
        >
          {toggleDarkMode ? (
            <IoSunnyOutline size={"1.2rem"} />
          ) : (
            <MdDarkMode size={"1.2rem"} />
          )}
        </button>
        {session && <button onClick={() => logout()}>logout</button>}

        <Link to="/login" className={styles.navbutton}>
          <FaUser size={"1.2rem"} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
