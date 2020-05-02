import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Youtube from "react-youtube";
import { useVideoContext } from "./VideoContext";
import { useSeekEffect, usePlayEffect } from "./effects";
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
  const {
    getCurrentTime,
    val: { isPlaying },
  } = useVideoContext();

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

  const { setPlay } = useVideoContext();
  function onStateChange(e) {
    console.log(e);
    const play = 1;
    const stop = 2;
    if (e.data == play) setPlay(true);
    if (e.data == stop) setPlay(false);
  }
  const { togglePlay } = useVideoContext();

  return (
    <>
      {player && (
        <div style={{ float: "right" }}>
          volume
          <SoundVolumeInput {...{ player }} />
        </div>
      )}
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
            disabled={!player}
            onClick={togglePlay}
          />
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

function SoundVolumeInput({ player }) {
  const [volume, setVolume] = useState(() => player.getVolume());
  console.log(volume);
  function onChange(e) {
    const v = e.target.value;
    setVolume(v);
    player.setVolume(v);
  }

  return (
    <input type="range" min="o" max="100" value={volume} onChange={onChange} />
  );
}
