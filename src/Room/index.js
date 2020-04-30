import React, { useState, useEffect } from "react";

import { Provider, useRoomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";

import VideoPlayer from "./VideoPlayer";
import CommentArea from "./CommentArea";
import ChatArea from "./ChatArea";
import MyInput from "../MyInput";

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
    val: { videoId },
    ref: roomRef,
  } = useRoomContext();

  function sendVideoId(id) {
    roomRef.child("videoId").set(id);
    roomRef.child("isPlaying").set(false);
    roomRef.child("startAt").set(Date.now());
    roomRef.child("stopAt").set(0);
  }
  return (
    <>
      <MyInput defaultVal={videoId} onEnter={sendVideoId} />
      {videoId ? <RoomLayout /> : "input youtube video id"}
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
      <div style={{ display: "flex", height: "50vh" }}>
        <div style={{ width: "80%", maxWidth: 640 }}>
          <VideoPlayer {...{ videoId }} />
        </div>
        <div style={{ height: "100%" }}>
          <ChatArea chats={chats} chatRef={roomRef.child("chats")} />
        </div>
      </div>
      <div>
        <CommentArea
          comments={comments}
          commentRef={roomRef.child("comments")}
        />
      </div>
    </>
  );
}
