import React, { useContext } from "react";
import { Grid, Avatar, Typography, Paper, ButtonBase } from "@mui/material";
import AuthContext from "../contexts/authContext/AuthContext";
const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          margin: "auto",
          maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Avatar alt="complex" src={user.photo} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {user.username}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Email: {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provider: {user.provider}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Profile;
