import React, { useState } from "react";
import styles from "./Signup.module.scss";
const Signup = () => {
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    username: "",
  });
  async function signup() {
    const res = await fetch("http://localhost:2222/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userForm),
    });
    const token = await res.json();
    console.log(token);
  }
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signup();
  };
  return (
    <div>
      <p>email:{userForm.email}</p>
      <p>password:{userForm.password}</p>
      <p>username:{userForm.username}</p>

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
        <button type="submit" className={styles.signupBtn}>
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
