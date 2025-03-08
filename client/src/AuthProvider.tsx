import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState("token");

  const value: any = {
    token,
  };

  // on render check from the backend if user has accessToken, setToken if available, if null redirect to login
  useEffect(() => {
    const validateAuth = async () => {
      // if token is null
      // create a new token
      // else, validate token
      try {
        const token = await fetch(
          "http://localhost:2222/api/user/validateToken"
        );
        if (token.token == null) {
          throw new Error("token does not exist");
        }
        const auth = await token.json();
        console.log(auth);
      } catch (error) {
        console.log(error);
      }
    };
    validateAuth();
  }, [token]);
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
