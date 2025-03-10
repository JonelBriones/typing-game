import { useState } from "react";
import styles from "./Login.module.scss";
import { useAuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import { IoLogInOutline } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";

const Login = ({ error, setError }: any) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { session, setSession, setToken } = useAuthContext();
  // const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");

  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
  });
  console.log(session, error);
  async function login() {
    // setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });

      const data = await res.json();

      if (res.status == 401) {
        setError(data?.error);
        throw new Error("wrong pass");
      }

      if (!data) {
        console.log("error");
      }
      console.log(data);
      setToken(data.accessToken);
      setSession(data.session);
      // setMessage(data.message);
      setError("");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmitHandler = (e: any) => {
    e.preventDefault();
    console.log("submit");
    login();
  };
  return (
    <div className={styles.loginContainer}>
      {/* {error && <h4>{error}</h4>} */}
      <div className={styles.header}>
        <IoLogInOutline size={"1.5rem"} />

        <h4>login</h4>
      </div>
      <div className={styles.providers}>
        <button className={styles.button}>
          <FaGoogle size={"1.5rem"} />
        </button>
        <button className={styles.button}>
          <FaGoogle size={"1.5rem"} />
        </button>
      </div>
      <span>or</span>
      <form onSubmit={onSubmitHandler} className={styles.authForm}>
        <input
          autoComplete="off"
          type="email"
          placeholder="email"
          name="email"
          value={userForm.email}
          onChange={(e) => onChangeHandler(e)}
        />
        <input
          autoComplete="off"
          type="password"
          placeholder="password"
          name="password"
          value={userForm.password}
          onChange={(e) => onChangeHandler(e)}
        />
        <button type="submit" className={styles.button}>
          login
        </button>
      </form>
      <button className={styles.forgotPassword}>forgot password?</button>
    </div>
  );
};

export default Login;
