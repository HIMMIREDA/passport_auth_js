import React, { createContext, useReducer } from "react";
import authReducer from "./AuthReducer";

const AuthContext = createContext();

export function AuthProvider({children}) {
  const initialState = {
    user: null,
    loading: false,
    success: false,
    error: false,
    message: "",
  };

  const [state,dispatch] = useReducer(authReducer,initialState);
  return (
    <AuthContext.Provider value={{
        ...state,
        dispatch
    }}>
        {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
