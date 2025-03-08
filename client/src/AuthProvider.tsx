import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { redirect } from "react-router-dom";

const AuthContext = createContext(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(null);

  const value: any = {
    session,
    setSession,
    token,
    setToken,
  };

  useEffect(() => {
    console.log("checking token: ", session);

    if (session === null) {
      console.log(window.location.pathname);
      console.log("session is empty", session);

      const validateAuth = async () => {
        const res = await fetch("http://localhost:2222/api/user/refresh", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const refreshToken = await res.json();
        console.log(refreshToken);
        setToken(refreshToken.accessToken);
        setSession(refreshToken.decoded);
      };
      validateAuth();
      if (window.location.pathname !== "/login") {
        redirect("/login");
      }
    }
  }, [token]);

  useEffect(() => {
    console.log(session);
    if (session?._id) {
      console.log("token id valid", session._id);
      const fetchData = async () => {
        const resUser = await fetch(
          `http://localhost:2222/api/user/${session._id}`
        );
        const user = await resUser.json();
        setSession(user);
      };
      fetchData();
    }
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export function useAuthContext() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("use Auth must be within a AuthProvider");
  }

  return useContext(AuthContext);
}
