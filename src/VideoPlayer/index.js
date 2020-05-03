import React, { useState, useEffect } from "react";
import { useRoomContext } from "../contexts";

import VideoPlayer from "./VideoPlayer";
import CommentsArea from "./CommentsArea";

import { Provider, useVideoContext } from "./VideoContext";

export default function Container({ video, volume }) {
  return (
    <Provider dbRef={video.ref} volume={volume}>
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
          <CommentsArea context={useVideoContext} />
        </>
      )}
    </>
  );
}
