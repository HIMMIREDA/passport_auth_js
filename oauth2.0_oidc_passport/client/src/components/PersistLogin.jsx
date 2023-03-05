import React, { useContext } from "react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Spinner from "./Spinner";
import { useEffect } from "react";
import axios from "axios";
import AuthContext from "../contexts/authContext/AuthContext";
import { logoutUser } from "../contexts/authContext/AuthActions";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // try getting the logged in user using the session cookie
    let isMounted = true;
    const abortController = new AbortController();
    const verifyUser = async () => {
      try {
        const response = await axios.get("/api/users/me", {
          signal: abortController.signal,
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 400,
        });
        if (isMounted) {
          dispatch({ type: "SET_USER", payload: response.data });
          setIsLoading(false);
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          setIsLoading(false);
          await logoutUser();
          dispatch({ type: "CLEAR_USER" });
          navigate("/login");
        }
      }
    };

    !user ? verifyUser() : setIsLoading(false);
    return () => {
      isMounted = false;
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  return <Outlet />;
};

export default PersistLogin;
