import { useEffect, useState } from "react";
// import styles from "../App.module.scss";
import { FaRegKeyboard } from "react-icons/fa";
import styles from "./Navbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaRegUser } from "react-icons/fa6";

import Logo from "/assets/logostacked.png";
import Cloud from "/assets/cloudlogo.png";
import { MdDarkMode } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import { useAuthContext } from "../../AuthProvider";
import { FaTrophy } from "react-icons/fa";
import { logout } from "../../api/auth";
const Navbar = () => {
  const { setSession, setToken, user } = useAuthContext() as any;
  const navigate = useNavigate();
  const preferenceTheme = () => {
    const preference = localStorage.getItem("theme");
    if (preference) return preference === "dark";
    return window.matchMedia("(prefers-color-scheme:dark)").matches;
  };
  const [toggleDarkMode, setToggleDarkMode] = useState(preferenceTheme());
  const [hoverProfile, setHoverProfile] = useState(false);

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

  async function logoutHandler() {
    logout();
    setSession(null);
    setToken(null);
    navigate("/");
  }
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/" className={styles.logoMobile}>
          <img src={Cloud} />
        </Link>
        <Link to="/" className={styles.logo}>
          <img src={Logo} />
        </Link>
        <Link to="/leaderboard">
          <FaTrophy />
        </Link>
        <Link to="/">
          <FaRegKeyboard />
        </Link>
      </div>
      <div className={styles.navRight}>
        <button
          onClick={() => setToggleDarkMode(!toggleDarkMode)}
          className={`${styles.toggleDarkMode}`}
        >
          {toggleDarkMode ? <IoSunnyOutline /> : <MdDarkMode />}
        </button>

        {user ? (
          <div
            onMouseEnter={() => setHoverProfile(true)}
            className={`${styles.profileActionsContainer}`}
          >
            <FaUser size={"1.2rem"} />
            {hoverProfile && (
              <div
                className={styles.hoverActive}
                onMouseLeave={() => setHoverProfile(false)}
              >
                <div
                  className={styles.profileActions}
                  onMouseLeave={() => setHoverProfile(false)}
                >
                  <Link to={`/profile/${user.username}`}>profile</Link>
                  <Link to="/settings">settings</Link>
                  <button
                    onClick={() => logoutHandler()}
                    className={styles.logoutBtn}
                  >
                    logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.navbutton}>
            <FaRegUser size={"1.2rem"} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
