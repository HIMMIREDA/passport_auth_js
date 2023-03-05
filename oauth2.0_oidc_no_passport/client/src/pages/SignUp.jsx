import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Navigate,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import React, { useContext, useEffect, useState } from "react";
import {
  loginUserlocal,
  registerUserlocal,
} from "../contexts/authContext/AuthActions";
import AuthContext from "../contexts/authContext/AuthContext";
import Spinner from "../components/Spinner";
import getGoogleUrl from "../utils/getGoogleUrl";
import ToggleModeBtn from "../components/ToggleModeBtn";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch, user, loading, error, message } = useContext(AuthContext);
  const from = location.state?.from?.pathname || "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    passwordVerif: "",
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({ type: "SET_LOADING" });
    try {
      const { data } = await registerUserlocal({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        passwordVerif: formData.passwordVerif,
      });
      console.log(data);
      dispatch({ type: "SET_USER", payload: data });
      navigate(from);
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString(),
      });
    }
  };

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, []);

  return user ? (
    <Navigate to={from} />
  ) : loading ? (
    <Spinner />
  ) : (
    <>
      <ToggleModeBtn />
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        component="main"
        maxWidth="xs"
        sx={{ minHeight: "100vh" }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {error && (
              <Alert severity="error">
                <AlertTitle>Errors : </AlertTitle>
                {Array.isArray(message) ? (
                  message.map((message,index) => <p key={index}>{message}</p>)
                ) : (
                  <p>{message}</p>
                )}
              </Alert>
            )}
            <TextField
              value={formData.email}
              onChange={onChange}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              value={formData.username}
              onChange={onChange}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              value={formData.password}
              onChange={onChange}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              value={formData.passwordVerif}
              onChange={onChange}
              margin="normal"
              required
              fullWidth
              name="passwordVerif"
              label="Confirm password"
              type="password"
              id="passwordVerif"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <GoogleLoginButton
                style={{
                  width: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  window.location.href = getGoogleUrl("/register");
                }}
              />
            </Grid>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <Link to="/login" component={RouterLink} variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </>
  );
};

export default SignUp;
