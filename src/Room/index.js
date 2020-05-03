import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { Provider, useRoomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";

import VideoPlayer from "../VideoPlayer/index.js";
import VideoList from "../VideoList";
import URLInput from "../URLInput";

import VolumeSlider from "../VolumeSlider";
export default function Room() {
  const { name } = useParams();
  return (
    <Provider name={name}>
      <RoomLayout />
    </Provider>
  );
}

const sendVideDataToRoom = (roomRef) => (data) => {
  if (!data?.id) return;
  const dbRef = roomRef.child("videos").push();
  dbRef.child("videoType").set(data);
  dbRef.child("isPlaying").set(false);
  dbRef.child("seekToTime").set(0);
};

const URLInputStyled = styled(URLInput)`
  margin-top: 1rem;
`;

const TopRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
`;
function RoomLayout() {
  const {
    val: { currentVideoKey },
    ref: roomRef,
  } = useRoomContext();
  const videosRef = roomRef.child("videos").orderByKey().ref;
  const [video, setVideo] = useState();

  const sendVideoData = sendVideDataToRoom(roomRef);
  function selectVideo(videoSnapshot) {
    roomRef.child("currentVideoKey").set(videoSnapshot.key);
    setVideo(videoSnapshot);
  }

  // volume
  const state = useState(() => 5);
  return (
    <>
      <TopRight>
        volume
        <VolumeSlider {...{ state }} />
      </TopRight>
      <div className="columns">
        <div className="column is-3">
          <VideoList
            {...{ videosRef, currentVideoKey }}
            onSelect={selectVideo}
          />
          <URLInputStyled defaultVal={""} onEnter={sendVideoData} />
        </div>
        <div className="column">
          {video && <VideoPlayer video={video} volume={state[0]} />}
        </div>
      </div>
    </>
  );
}
