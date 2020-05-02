import React, { useState, useEffect } from "react";
import Youtube from "react-youtube";
import { useRoomContext } from "../ContextRoom";

import useTick from "./useTick";

const opts = {
  width: "100%",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    modestbranding: 1,
    iv_load_policy: 3,
    disablekb: 1,
  },
};

export default function VideoPlayer({ videoId }) {
  const {
    getCurrentTime,
    val: { seekToTime, isPlaying },
    ref: roomRef,
  } = useRoomContext();
  const [player, setPlayer] = useState(null);

  // control seekbar by seekToTime
  useEffect(() => {
    if (player && seekToTime) {
      player.seekTo(seekToTime);
      roomRef.child("seekToTime").set(null);
    }
  }, [player, seekToTime]);

  // control player corresponding to db state
  useEffect(() => {
    if (player) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }
  }, [isPlaying, player]);

  const onReady = (event) => {
    setPlayer(event.target);
    const seconds = getCurrentTime().as("seconds");
    if (isPlaying) event.target.seekTo(seconds);
    else event.target.seekTo(seconds).pauseVideo();
  };
  return (
    <>
      <Youtube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        style={{ width: "100%" }}
      />
      {player && (
        <div style={{ display: "flex" }}>
          <ToggleButton isPlaying={isPlaying} disabled={!player} />
          <div style={{ flex: 1 }}>
            <Seekbar isPlaying={isPlaying} duration={player.getDuration()} />
          </div>
          <div>
            <PlayTimeStr />
          </div>
        </div>
      )}
      <hr />
    </>
  );
}

function ToggleButton({ isPlaying, disabled = true }) {
  const { togglePlay } = useRoomContext();
  return (
    <button
      type="button"
      onClick={togglePlay}
      disabled={disabled}
      style={{ fontSize: 30, width: "100px" }}
    >
      {isPlaying ? "Puase" : "Play"}
    </button>
  );
}

function Seekbar({ duration, isPlaying }) {
  const {
    seekTo,
    getCurrentTime,
    val: { seekToTime },
  } = useRoomContext();

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

function PlayTimeStr() {
  const {
    getCurrentTime,
    val: { isPlaying, seekToTime },
  } = useRoomContext();

  const [updated] = useTick(1000);
  const [time, setTime] = useState(() => getCurrentTime());

  useEffect(() => {
    setTime(getCurrentTime());
  }, [isPlaying, seekToTime, updated]);

  return <span>{time.toFormat("mm:ss")}</span>;
}
