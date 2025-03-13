import React, { createContext, useContext, useEffect, useState } from "react";
import { getRefreshToken } from "./api/auth";
import { getUserById } from "./api/users";

const AuthContext = createContext<any>(null);
interface Session {
  _id: string;
}
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // const [loading, setLoading] = useState(false);
  const value: any = {
    session,
    setSession,
    token,
    setToken,
    user,
  };

  useEffect(() => {
    if (token == null) {
      const validateAuth = async () => {
        const refreshToken = await getRefreshToken();

        if (refreshToken) {
          setToken(refreshToken.accessToken);
          setSession({
            _id: refreshToken.session._id,
          });
        } else {
          console.error("Failed to get refresh token");
        }
      };
      validateAuth();
    }
  }, []);

  useEffect(() => {
    if (!session?._id) return;
    const fetchData = async () => {
      const res = await getUserById(session._id);

      if (!res) {
        console.error("Failed to fetch user by id");
      } else {
        setUser(res.session);
      }
    };
    fetchData();
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
