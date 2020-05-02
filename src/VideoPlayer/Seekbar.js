import React, { useState, useEffect } from "react";
import { useVideoContext } from "./VideoContext";

function Seekbar({ duration, isPlaying }) {
  const {
    seekTo,
    getCurrentTime,
    val: { seekToTime },
  } = useVideoContext();

  const [updated, setUpdated] = useState();
  const [time, setTime] = useState(() => getCurrentTime().as("seconds"));

  useEffect(() => {
    if (isPlaying) {
      let id = setTimeout(() => {
        setTime(getCurrentTime().as("seconds"));
        setUpdated([]);
      }, 100);
      return () => clearTimeout(id);
    }
  }, [time, updated, isPlaying]);

  useEffect(() => {
    if (seekToTime) setTime(seekToTime);
  }, [seekToTime]);

  function onChange(e) {
    const sec = parseFloat(e.target.value, 10);
    seekTo(sec);
    setTime(sec);
  }
  return (
    <input
      type="range"
      max={duration}
      step={0.1}
      style={{ width: "100%" }}
      value={time}
      onChange={onChange}
    />
  );
}

export default Seekbar;
