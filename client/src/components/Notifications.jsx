import { Button, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useMemo } from "react";

import Ring from "../resources/sounds/ring.mp3";
import { SocketContext } from "../SocketContext";

const Notifications = () => {
  const { answerCall, call, callAccepted, declineCall } =
    useContext(SocketContext);

  const ringAudio = useMemo(() => new Audio(Ring), []);

  useEffect(() => {
    if (call && call.isRecievedCall && !callAccepted) {
      ringAudio.loop = true;
      ringAudio.play();
    } else {
      ringAudio.pause();
      ringAudio.currentTime = 0;
    }
  }, [call, callAccepted, ringAudio]);

  return (
    <>
      {call && call.isRecievedCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h5" style={{ margin: 5 }}>
            {call.callerName} is calling:{" "}
          </Typography>
          <Button
            style={{ margin: 5 }}
            variant="contained"
            color="primary"
            onClick={answerCall}
          >
            Answer
          </Button>
          <Button
            style={{ margin: 5 }}
            variant="contained"
            color="secondary"
            onClick={declineCall}
          >
            Decline
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;
