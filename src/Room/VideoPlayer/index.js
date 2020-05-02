import React, { useState, useEffect } from "react";
import Youtube from "react-youtube";
import { useRoomContext } from "../ContextRoom";

import useTick from "./useTick";
import Seekbar from "./Seekbar";

const opts = {
  width: "100%",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    controls: 0,
    modestbranding: 1,
    iv_load_policy: 3,
    disablekb: 1,
  },
};

function useSeekEffect(player) {
  const {
    val: { seekToTime },
    ref: roomRef,
  } = useRoomContext();

  useEffect(() => {
    if (player && seekToTime) {
      player.seekTo(seekToTime);
      roomRef.child("seekToTime").set(null);
    }
  }, [player, seekToTime]);
}

function usePlayEffect(player) {
  const {
    val: { isPlaying },
  } = useRoomContext();

  useEffect(() => {
    if (player) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }
  }, [isPlaying, player]);
}
export default function VideoPlayer({ videoId }) {
  const {
    getCurrentTime,
    val: { isPlaying },
  } = useRoomContext();

  const [player, setPlayer] = useState(null);
  // control seekbar by db state
  useSeekEffect(player);
  // control player by db state
  usePlayEffect(player);

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
