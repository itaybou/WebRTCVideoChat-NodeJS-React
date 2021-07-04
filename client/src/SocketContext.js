import React, { createContext, useEffect, useRef, useState } from "react";

import Peer from "simple-peer";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io("http://localhost:5000");

export const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [id, setId] = useState(null);
  const [call, setCall] = useState(null);
  const [name, setName] = useState("");
  const [muted, setMuted] = useState(false);

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const userVideoRef = useRef();
  const peerVideoRef = useRef();

  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        userVideoRef.current.srcObject = currentStream;
      });

    socket.on("id", (currentId) => setId(currentId));
    socket.on("call_user", ({ from, name: callerName, signal }) => {
      setCall({ isRecievedCall: true, from, callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answer_call", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      peerVideoRef.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const declineCall = () => {
    setCallAccepted(false);
    setCall(null);
  };

  const callUser = (toCallId) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("call_user", {
        userCallId: toCallId,
        signalData: data,
        from: id,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      peerVideoRef.current.srcObject = currentStream;
    });

    socket.on("call_accepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();

    window.location.reload();
  };

  const muteUnmuteMic = () => {
    setMuted(stream.getAudioTracks()[0].enabled);
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        userVideoRef,
        peerVideoRef,
        stream,
        name,
        setName,
        callEnded,
        id,
        callUser,
        leaveCall,
        answerCall,
        declineCall,
        muted,
        muteUnmuteMic,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
