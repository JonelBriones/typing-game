import { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { useAuthContext } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";
import { IoLogInOutline } from "react-icons/io5";
// import { FaGoogle } from "react-icons/fa";
import { login } from "../../api/auth.ts";

const Login = ({ setError }: any) => {
  const navigate = useNavigate();

  const { session, setSession, setToken } = useAuthContext();

  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
  });

  async function handleLogin() {
    const res = await login(userForm);
    if (res.error) {
      console.log(res.error);
      setError(res.error);
    } else {
      console.log(res);
      setToken(res.accessToken);
      setSession({
        _id: res.session._id,
      });
      setError("");
      navigate("/");
    }
  }

  useEffect(() => {
    if (session?._id) {
      console.log("redirect");
      navigate("/");
    }
  }, [session]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmitHandler = (e: any) => {
    e.preventDefault();
    console.log("submit");
    handleLogin();
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <IoLogInOutline size={"1.5rem"} />
        <h4>login</h4>
      </div>
      {/* <div className={styles.providers}>
        <button className={styles.button}>
          <FaGoogle size={"1.5rem"} />
        </button>
        <button className={styles.button}>
          <FaGoogle size={"1.5rem"} />
        </button>
      </div>
      <span>or</span> */}
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
