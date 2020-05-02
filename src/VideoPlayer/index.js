import React, { useState, useEffect } from "react";
import { useRoomContext } from "../Room/ContextRoom";
import { useList } from "react-firebase-hooks/database";

import URLInput from "../URLInput";
import VideoPlayer from "./VideoPlayer";
import CommentArea from "./CommentArea";

import { Provider, useVideoContext } from "./VideoContext";

export default function Container(props) {
  const { val, ref: roomRef } = useRoomContext();
  const videoRef = roomRef.child("videos").orderByKey().ref;

  const [snapshots] = useList(videoRef);

  const currentVideoKey = val.currentVideoKey;
  const video = currentVideoKey ? videoRef.child(currentVideoKey) : null;
  const lastVideo = snapshots[snapshots.length - 1];

  function sendVideoData(data) {
    const dbRef = roomRef.child("videos").push();
    dbRef.child("videoType").set(data);
    dbRef.child("isPlaying").set(false);
    dbRef.child("seekToTime").set(0);
  }
  function selectVideo(videoSnapshot) {
    roomRef.child("currentVideoKey").set(videoSnapshot.key);
  }
  return (
    <>
      <ul>
        {snapshots.map((s) => {
          return (
            <li key={s.key}>
              <a
                onClick={(e) => {
                  selectVideo(s);
                  e.preventDefault();
                }}
                href="#"
              >
                {s.toJSON().videoType.id}
              </a>
              {s.key === video?.key && "←"}
            </li>
          );
        })}
      </ul>
      <URLInput defaultVal={""} onChange={sendVideoData} />
      {video && (
        <Provider dbRef={video.ref}>
          <InVideoContext />
        </Provider>
      )}
    </>
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
        <div>
          <VideoPlayer videoId={videoType.id} />
          <CommentArea context={useVideoContext} />
        </div>
      )}
    </>
  );
}
