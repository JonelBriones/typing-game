import React from "react";
import styles from "./Login.module.scss";
const Login = () => {
  async function login() {
    const res = await fetch("http://localhost:2222/api/user/generateToken", {
      method: "POST",
    });
    const token = await res.json();
    console.log(token);
  }
  return (
    <div>
      <button onClick={() => login()} className={styles.loginBtn}>
        Login
      </button>
    </div>
  );
};

export default Login;
