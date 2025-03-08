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
    const validateAuth = async () => {
      const res = await fetch("http://localhost:2222/api/user/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res) return;
      const refreshToken = await res.json();
      setToken(refreshToken.accessToken);
      setSession(refreshToken.decoded);
    };
    validateAuth();
  }, [token]);

  useEffect(() => {
    console.log(session);
    if (session?._id) {
      console.log("token id valid", session._id);
      const fetchData = async () => {
        const resUser = await fetch(
          `http://localhost:2222/api/user/user/${session._id}`
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
