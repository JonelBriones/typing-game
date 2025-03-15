import React, { useEffect, useState } from "react";
import styles from "./Signup.module.scss";
import { useAuthContext } from "../../AuthProvider";
import { IoMdPersonAdd } from "react-icons/io";
// import { IoPersonAddOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { HiMiniXMark } from "react-icons/hi2";
import useDebounceSearch from "../../hooks/user.hook";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { getUsername } from "../../api/users";
import { signup } from "../../api/auth.ts";
const defaultForm = {
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
  username: "",
};
const Signup = () => {
  const navigate = useNavigate();

  const [userForm, setUserForm] = useState(defaultForm);
  const { setSession, setToken } = useAuthContext();
  // console.log(error, session);
  const [isloading, setIsLoading] = useState(false);
  const [userTaken, setUserTaken] = useState(false);
  const debounceSearch = useDebounceSearch(userForm.username);

  async function signupHandler() {
    const res = await signup(userForm);

    if (res.status == 401) {
      console.log(res);
    } else {
      console.log(res);
      setToken(res.accessToken);
      setSession({
        _id: res.session._id,
      });
      setUserForm(defaultForm);
      navigate("/");
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

    signupHandler();
  };

  let emailRegex: RegExp = /^[^@]+@[^@]+\.[^@]+$/;
  let passwordRegex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  function validateRegex(string: string, pattern: RegExp) {
    return pattern.test(string);
  }
  const [emailValid, setEmailValid] = useState(false);

  useEffect(() => {
    if (userForm.email.length > 0) {
      setEmailValid(validateRegex(userForm.email, emailRegex));
    }
  }, [userForm.email]);

  function checkValidation(type: "email" | "password") {
    let isEmail = type == "email";
    let value = isEmail ? userForm.email : userForm.password;
    let regex = isEmail ? emailRegex : passwordRegex;

    if (value.length > 0) {
      if (validateRegex(value, regex)) {
        return <IoCheckmark className={styles.checkmark} />;
      } else {
        return <HiMiniXMark className={styles.xmark} />;
      }
    }
  }

  function validateConfirm(type: "email" | "password") {
    const isEmail = type === "email";
    const value = isEmail ? userForm.email : userForm.password;
    const confirmValue = isEmail
      ? userForm.confirmEmail
      : userForm.confirmPassword;

    if (value.length > 0) {
      if (value == confirmValue && emailValid) {
        return <IoCheckmark className={styles.checkmark} />;
      } else {
        return <HiMiniXMark className={styles.xmark} />;
      }
    } else if (confirmValue.length > 0) {
      return <HiMiniXMark className={styles.xmark} />;
    }
  }

  function validateUsername() {
    if (userForm.username.length > 0) {
      if (!userTaken) {
        return <IoCheckmark className={styles.checkmark} />;
      } else {
        return <HiMiniXMark className={styles.xmark} />;
      }
    }
  }

  useEffect(() => {
    if (userForm.username.length == 0) return;

    const checkUsername = async () => {
      setIsLoading(true);
      const res = await getUsername(debounceSearch);
      setUserTaken(res == null ? false : true);
      setIsLoading(false);
    };
    checkUsername();
  }, [debounceSearch]);

  return (
    <div className={styles.signupContainer}>
      <div className={styles.header}>
        <IoMdPersonAdd size={"1.5rem"} />
        <h4>create an account</h4>
      </div>
      <form action="" onSubmit={onSubmitHandler} className={styles.authForm}>
        <div>
          {checkValidation("email")}
          <input
            type="email"
            placeholder="email"
            name="email"
            value={userForm.email}
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
        <div>
          {validateConfirm("email")}
          <input
            autoComplete="off"
            type="email"
            placeholder="confirmEmail"
            name="confirmEmail"
            value={userForm.confirmEmail}
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
        <div>
          {checkValidation("password")}
          <input
            autoComplete="off"
            type="password"
            placeholder="password"
            name="password"
            value={userForm.password}
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
        <div>
          {validateConfirm("password")}
          <input
            autoComplete="off"
            type="password"
            placeholder="confirmPassword"
            name="confirmPassword"
            value={userForm.confirmPassword}
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
        <div>
          {isloading ? (
            <div className={styles.loading}>
              <LoadingSpinner size={"1.25rem"} />
            </div>
          ) : (
            validateUsername()
          )}
          <input
            autoComplete="off"
            type="text"
            placeholder="username"
            name="username"
            value={userForm.username}
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
        <button
          type="submit"
          className={
            !userForm.email || !userForm.password || !userForm.username
              ? styles.disabled
              : ""
          }
          disabled={!userForm.email || !userForm.password || !userForm.username}
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Signup;
