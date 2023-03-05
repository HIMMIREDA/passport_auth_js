import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import AuthContext from "../contexts/authContext/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Grid
        container
        wrap="nowrap"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Typography variant="h2" textAlign="center">
          Welcome {user.username} !
        </Typography>
      </Grid>
    </>
  );
};

export default Home;
