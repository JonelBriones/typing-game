import React, { createContext, useContext, useEffect, useState } from "react";
import { getRefreshToken, getUserById } from "./api/auth";

const AuthContext = createContext<any>(null);
interface Session {
  _id: string;
}
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState(null);

  const value: any = {
    session,
    setSession,
    token,
    setToken,
  };

  useEffect(() => {
    if (!token && !session) {
      const validateAuth = async () => {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          setToken(refreshToken.accessToken);
          setSession(refreshToken.decoded);
        } else {
        }
      };
      validateAuth();
    }
  }, [token]);

  useEffect(() => {
    // use when needed user data
    if (session?._id) {
      const fetchData = async () => {
        const user = await getUserById(session._id);
        if (user) {
          setSession(user);
        } else {
          console.error("Failed to fetch user by id");
        }
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
