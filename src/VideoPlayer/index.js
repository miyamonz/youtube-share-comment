import React, { useState, useEffect } from "react";
import { useRoomContext } from "../Room/ContextRoom";

import VideoList from "./VideoList";
import URLInput from "../URLInput";

import VideoPlayer from "./VideoPlayer";
import CommentArea from "./CommentArea";

import { Provider, useVideoContext } from "./VideoContext";

export default function Container(props) {
  const { val, ref: roomRef } = useRoomContext();

  const videosRef = roomRef.child("videos").orderByKey().ref;
  const currentVideoKey = val.currentVideoKey;

  const [video, setVideo] = useState();

  function sendVideoData(data) {
    const dbRef = roomRef.child("videos").push();
    dbRef.child("videoType").set(data);
    dbRef.child("isPlaying").set(false);
    dbRef.child("seekToTime").set(0);
  }
  function selectVideo(videoSnapshot) {
    roomRef.child("currentVideoKey").set(videoSnapshot.key);
    setVideo(videoSnapshot);
  }
  return (
    <div className="tile is-ancestor">
      <div className="tile is-3">
        <div>
          <VideoList
            {...{ videosRef, currentVideoKey }}
            onSelect={selectVideo}
          />
          <URLInput defaultVal={""} onEnter={sendVideoData} />
        </div>
      </div>
      <div className="tile">
        <div className="tile is-child">
          {video && (
            <Provider dbRef={video.ref}>
              <InVideoContext />
            </Provider>
          )}
        </div>
      </div>
    </div>
  );
}
function InVideoContext() {
  const {
    val: { videoType },
  } = useVideoContext();
  const url = videoType ? `https://youtube.com/?v=${videoType.id}` : "";
  return (
    <>
      {!videoType && "enter youtube URL"}

      {videoType && (
        <>
          <VideoPlayer videoId={videoType.id} />
          <CommentArea context={useVideoContext} />
        </>
      )}
    </>
  );
}
