import React, { useState, useEffect } from "react";

import { useList } from "react-firebase-hooks/database";

import { getVideoTitle } from "./YoutubeAPI.js";
import styled from "styled-components";

function VideoList({ videosRef, currentVideoKey, onSelect }) {
  const [snapshots] = useList(videosRef);

  const VideoLink = ({ snapshot, ...props }) => {
    const isActive = snapshot.key === currentVideoKey;

    const videoId = snapshot.toJSON().videoType?.id;

    const [title, setTitle] = useState(videoId);
    useEffect(() => {
      if (videoId) {
        getVideoTitle(videoId).then(setTitle);
      }
    }, [videoId]);
    return (
      <a
        onClick={(e) => {
          onSelect(snapshot);
          e.preventDefault();
        }}
        href="#"
        className={isActive ? "is-active" : ""}
        {...props}
      >
        {title}
      </a>
    );
  };

  useEffect(() => {
    if (currentVideoKey) {
      onSelect(videosRef.child(currentVideoKey));
    }
  }, [currentVideoKey]);
  return (
    <aside className="menu">
      <p className="menu-label">videos</p>
      <ul className="menu-list">
        {snapshots.map((s) => {
          return (
            <li key={s.key}>
              <VideoLink snapshot={s} />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default VideoList;
