import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);
interface Session {
  _id: string;
}
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const API_URL = import.meta.env.VITE_BACKEND_BASEURL;
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState(null);

  const value: any = {
    session,
    setSession,
    token,
    setToken,
  };

  useEffect(() => {
    console.log(token, session);
    if (!token && !session) {
      const validateAuth = async () => {
        const res = await fetch(`${API_URL}/api/user/refresh`, {
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
    }
  }, [token]);

  useEffect(() => {
    // use when needed user data
    console.log(session);
    if (session?._id) {
      console.log("token id valid", session._id);
      const fetchData = async () => {
        const resUser = await fetch(`${API_URL}/api/user/${session._id}`);
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
