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
import { loginUserlocal } from "../contexts/authContext/AuthActions";
import AuthContext from "../contexts/authContext/AuthContext";
import Spinner from "../components/Spinner";
import getGoogleUrl from "../utils/getGoogleUrl";
import ToggleModeBtn from "../components/ToggleModeBtn";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch,user, loading, error, message } = useContext(AuthContext);
  const from = location.state?.from?.pathname || "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const { data } = await loginUserlocal({
        email: formData.email,
        password: formData.password,
      });

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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            margin="normal"
            value={formData.password}
            onChange={onChange}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
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
                console.log(from);
                window.location.href = getGoogleUrl(from);
              }}
            />
          </Grid>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <Link to="/register" component={RouterLink} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Grid>
    </>
  );
};

export default SignIn;
