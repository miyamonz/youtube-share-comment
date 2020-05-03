import React, { useState, useEffect } from "react";

import { useList } from "react-firebase-hooks/database";

import styled from "styled-components";

function VideoList({ videosRef, currentVideoKey, onSelect }) {
  const [snapshots] = useList(videosRef);

  const VideoLink = ({ snapshot, ...props }) => {
    const isActive = snapshot.key === currentVideoKey;

    const videoId = snapshot.toJSON().videoType?.id;
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
        {videoId}
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
