import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Youtube from "react-youtube";

import { useRoomContext, useVideoContext } from "../contexts";

import { useSeekEffect, usePlayEffect, useVolumeEffect } from "./effects";
import useTick from "./useTick";
import Seekbar from "./Seekbar";
import ToggleButton from "./ToggleButton";

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

export default function VideoPlayer({ videoId }) {
  const { mode } = useRoomContext();
  const {
    getCurrentTime,
    val: { isPlaying },
  } = useVideoContext();

  const [player, setPlayer] = useState(null);
  // control seekbar by db state
  useSeekEffect(player);
  // control player by db state
  usePlayEffect(player);
  useVolumeEffect(player);

  const onReady = (event) => {
    setPlayer(event.target);
    const seconds = getCurrentTime().as("seconds");
    if (isPlaying) event.target.seekTo(seconds);
    else event.target.seekTo(seconds).pauseVideo();
  };

  const { setPlay } = useVideoContext();
  function onStateChange(e) {
    const play = 1;
    const stop = 2;
    
    /* chattering
    if (e.data == play) setPlay(true);
    if (e.data == stop) setPlay(false);
    */
  }
  const { togglePlay } = useVideoContext();
  function onClickToggle() {
    if (mode === "view") return;
    togglePlay();
  }

  return (
    <>
      <Youtube
        videoId={videoId}
        opts={opts}
        onStateChange={onStateChange}
        onReady={onReady}
        style={{ width: "100%" }}
      />
      {player && (
        <div style={{ display: "flex" }}>
          <ToggleButton
            isPlaying={isPlaying}
            disabled={mode === "view" ? true : !player}
            onClick={onClickToggle}
          />
          <div style={{ flex: 1 }}>
            <Seekbar isPlaying={isPlaying} duration={player.getDuration()} />
          </div>
          <div>
            <PlayTimeStr />
          </div>
        </div>
      )}
    </>
  );
}

function PlayTimeStr() {
  const {
    getCurrentTime,
    val: { isPlaying, seekToTime },
  } = useVideoContext();

  const [updated] = useTick(1000);
  const [time, setTime] = useState(() => getCurrentTime());

  useEffect(() => {
    setTime(getCurrentTime());
  }, [isPlaying, seekToTime, updated]);

  return <span>{time.toFormat("mm:ss")}</span>;
}
