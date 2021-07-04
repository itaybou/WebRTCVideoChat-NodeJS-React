import { Grid, Paper, Typography } from "@material-ui/core";
import React, { useContext } from "react";

import { SocketContext } from "../SocketContext";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "700px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "1px solid rgb(184, 194, 207)",
    margin: "10px",
  },
}));

const VideoPlayer = () => {
  const classes = useStyles();
  const {
    userVideoRef,
    peerVideoRef,
    name,
    callAccepted,
    callEnded,
    stream,
    call,
    muted,
  } = useContext(SocketContext);

  return (
    <Grid container className={classes.gridContainer}>
      {/* User video */}
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || "User Name"}
            </Typography>
            <video
              playsInline
              muted
              ref={userVideoRef}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
      )}
      {/* Peer video */}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {call.callerName || "Peer Name"}
            </Typography>
            <video
              playsInline
              ref={peerVideoRef}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
