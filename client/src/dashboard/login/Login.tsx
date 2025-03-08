import React, { useState } from "react";
import styles from "./Login.module.scss";
import { useAuthContext } from "../../AuthProvider";
const Login = () => {
  const { session, setSession, token, setToken } = useAuthContext();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    username: "",
  });
  async function login() {
    try {
      const res = await fetch("http://localhost:2222/api/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });

      const data = await res.json();

      if (res.status == 401) {
        setError(data.error);
        throw new Error("wrong pass");
      }

      if (!data) {
        console.log("error");
      }
      console.log(data);
      setToken(data.accessToken);
      setSession(data.session);
      // setMessage(data.message);
      // setError("");
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
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login();
  };
  return (
    <div>
      {session && (
        <div>
          <p>logged:{session.username}</p>
        </div>
      )}
      {error && <h4>{error}</h4>}
      <p>email:{userForm.email}</p>
      <p>password:{userForm.password}</p>
      <form action="" onSubmit={onSubmitHandler}>
        <input
          type="text"
          placeholder="email"
          name="email"
          value={userForm.email}
          onChange={(e) => onChangeHandler(e)}
        />
        <input
          type="text"
          placeholder="password"
          name="password"
          value={userForm.password}
          onChange={(e) => onChangeHandler(e)}
        />
        <input
          type="text"
          placeholder="username"
          name="username"
          value={userForm.username}
          onChange={(e) => onChangeHandler(e)}
        />
        <button type="submit" className={styles.loginBtn}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
