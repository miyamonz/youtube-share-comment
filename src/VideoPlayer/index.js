import React, { useState, useEffect } from "react";
import { useRoomContext } from "../Room/ContextRoom";

import URLInput from "../URLInput";
import VideoPlayer from "./VideoPlayer";
import CommentArea from "./CommentArea";

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

      {videoType && (
        <div>
          <VideoPlayer videoId={videoType.id} />
          <CommentArea context={useVideoContext} />
        </div>
      )}
    </>
  );
}
