import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import AuthContext from "../contexts/authContext/AuthContext";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const {user} = useContext(AuthContext);
  
  return user ? (
    <>
      <Header />
      {children}
    </>
  ) : (
    <Navigate to={"/login"} state={{from: location}} />
  );
};

export default ProtectedRoute;
