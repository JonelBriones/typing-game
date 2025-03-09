import React, { useState } from "react";
import Login from "../login/Login";
import Signup from "../signup/Signup";
import styles from "./Authentication.module.scss";
const Authentication = () => {
  const [error, setError] = useState("");
  console.log(error);
  return (
    <div className={styles.container}>
      <div className={styles.error}>
        <p>{error}</p>
      </div>
      <Signup error={error} setError={setError} />
      <Login error={error} setError={setError} />
    </div>
  );
};

export default Authentication;
