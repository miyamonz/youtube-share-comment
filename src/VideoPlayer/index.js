import React, { useState, useEffect } from "react";
import { useRoomContext } from "../Room/ContextRoom";

import VideoPlayer from "./VideoPlayer";
import CommentArea from "./CommentArea";

import { Provider, useVideoContext } from "./VideoContext";

export default function Container({ video }) {
  return (
    <Provider dbRef={video.ref}>
      <InVideoContext />
    </Provider>
  );
}
function InVideoContext() {
  const {
    val: { videoType },
  } = useVideoContext();
  const url = videoType ? `https://youtube.com/?v=${videoType.id}` : "";
  return (
    <>
      {videoType && (
        <>
          <VideoPlayer videoId={videoType.id} />
          <CommentArea context={useVideoContext} />
        </>
      )}
    </>
  );
}
