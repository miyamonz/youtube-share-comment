import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Youtube from "react-youtube";
import { useRoomContext } from "../ContextRoom";
import { useSeekEffect, usePlayEffect } from "./effects";

import URLInput from "../URLInput";

import useTick from "./useTick";
import Seekbar from "./Seekbar";
import ToggleButton from "./ToggleButton";

import { Provider, useVideoContext } from "./VideoContext";

export default function Container(props) {
  const { ref: roomRef } = useRoomContext();
  const videoRef = roomRef.child("video");
  return (
    <>
      <Provider dbRef={videoRef}>
        <InVideoContext />
      </Provider>
    </>
  );
}
function InVideoContext() {
  const {
    val: { videoType },
    dbRef,
  } = useVideoContext();
  const url = videoType ? `https://youtube.com/?v=${videoType.id}` : "";
  function sendVideoData(data) {
    dbRef.child("videoType").set(data);
    dbRef.child("isPlaying").set(false);
  }
  return (
    <>
      <URLInput defaultVal={url} onChange={sendVideoData} />
      {!videoType && "enter youtube URL"}

      {videoType && <VideoPlayer videoId={videoType.id} />}
    </>
  );
}

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

function VideoPlayer({ videoId }) {
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
  const { togglePlay } = useVideoContext();

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
