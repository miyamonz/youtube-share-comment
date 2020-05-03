import React, { useState, useEffect } from "react";

import { Provider, useRoomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";

import VideoPlayer from "../VideoPlayer/index.js";
import VideoList from "../VideoList";
import URLInput from "../URLInput";

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

// ここにvideolistひっぱりだすべきかも
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
  return (
    <div className="tile is-ancestor">
      <div className="tile is-3">
        <div className="tile is-child">
          <VideoList
            {...{ videosRef, currentVideoKey }}
            onSelect={selectVideo}
          />
          <URLInput defaultVal={""} onEnter={sendVideoData} />
        </div>
      </div>
      <div className="tile">
        <div className="tile is-child">
          {video && <VideoPlayer video={video} />}
        </div>
      </div>
    </div>
  );
}
