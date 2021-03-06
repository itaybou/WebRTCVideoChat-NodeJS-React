import {
  Assignment,
  Phone,
  PhoneDisabled,
  VolumeOff,
  VolumeUp,
} from "@material-ui/icons";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../SocketContext";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  gridContainer: {
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  container: {
    width: "600px",
    margin: "35px 0",
    padding: 0,
    [theme.breakpoints.down("xs")]: {
      width: "80%",
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: "10px 20px",
    border: "2px solid rgb(164, 173, 185)",
  },
}));

const Options = ({ children }) => {
  const classes = useStyles();
  const {
    id,
    callAccepted,
    callEnded,
    name,
    setName,
    leaveCall,
    callUser,
    muted,
    muteUnmuteMic,
  } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  return (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography variant="h6" gutterBottom>
                Account Info
              </Typography>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <CopyToClipboard text={id} className={classes.margin}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Assignment fontSize="large" />}
                  fullWidth
                >
                  Copy Your ID
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid item xs={12} md={6} className={classes.padding}>
              <Typography variant="h6" gutterBottom>
                Make A Call
              </Typography>
              <TextField
                label="ID to Call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                fullWidth
              />
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PhoneDisabled fontSize="large" />}
                  fullWidth
                  onClick={leaveCall}
                  className={classes.margin}
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Phone fontSize="large" />}
                  fullWidth
                  onClick={() => callUser(idToCall)}
                  className={classes.margin}
                >
                  Call
                </Button>
              )}
            </Grid>
            {callAccepted && !callEnded && (
              <Grid item xs={12} md={12} className={classes.padding}>
                <Button
                  variant="contained"
                  color={muted ? "primary" : "secondary"}
                  startIcon={
                    muted ? (
                      <VolumeUp fontSize="large" />
                    ) : (
                      <VolumeOff fontSize="large" />
                    )
                  }
                  fullWidth
                  onClick={muteUnmuteMic}
                  className={classes.margin}
                >
                  {`${muted ? "UnMute" : "Mute"}`}
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default Options;
