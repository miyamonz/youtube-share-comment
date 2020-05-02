import React, { useState, useEffect } from "react";

import { Provider, useRoomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";

import VideoPlayer from "./VideoPlayer/index.js";
import CommentArea from "./CommentArea";
import ChatArea from "./ChatArea";
import URLInput from "./URLInput";

export default function Room() {
  const { name } = useParams();
  return (
    <Provider name={name}>
      <RoomLoaded />
    </Provider>
  );
}

function RoomLoaded() {
  const {
    val: { videoType },
    ref: roomRef,
  } = useRoomContext();

  const url = videoType ? `https://youtube.com/?v=${videoType.id}` : "";
  function sendVideoData(data) {
    roomRef.child("videoType").set(data);
    roomRef.child("isPlaying").set(false);
  }
  return (
    <>
      <div>
        <URLInput defaultVal={url} onChange={sendVideoData} />
      </div>
      {videoType ? <RoomLayout /> : "input youtube video id"}
    </>
  );
}

function RoomLayout() {
  const {
    val: { videoId, comments = [], chats = [] },
    ref: roomRef,
  } = useRoomContext();
  return (
    <>
      <div style={{ display: "flex", height: 420 }}>
        <div style={{ width: "100%" }}>
          <VideoPlayer {...{ videoId, comments }} />
        </div>
      </div>
    </>
  );
}
