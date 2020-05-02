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

function RoomLayout() {
  const {
    val: { chats = [] },
  } = useRoomContext();
  return (
    <>
      <div style={{ display: "flex", height: 420 }}>
        <div style={{ width: "100%" }}>
          <VideoPlayer />
        </div>
      </div>
    </>
  );
}
