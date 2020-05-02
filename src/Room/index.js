import React, { useState, useEffect } from "react";

import { Provider, useRoomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";

import VideoPlayer from "../VideoPlayer/index.js";

export default function Room() {
  const { name } = useParams();
  return (
    <Provider name={name}>
      <RoomLayout />
    </Provider>
  );
}

// ここにvideolistひっぱりだすべきかも
function RoomLayout() {
  const {
    val: { chats = [] },
  } = useRoomContext();
  return (
    <>
      <div>
        <VideoPlayer />
      </div>
    </>
  );
}
