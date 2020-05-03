import React, { useState, useEffect } from "react";

import { useList } from "react-firebase-hooks/database";

import styled from "styled-components";

function VideoList({ videosRef, currentVideoKey, onSelect }) {
  const [snapshots] = useList(videosRef);

  useEffect(() => {
    if (currentVideoKey) {
      onSelect(videosRef.child(currentVideoKey));
    }
  }, [currentVideoKey]);

  const onDelete = (key) => videosRef.child(key).remove();
  return (
    <aside className="menu">
      <p className="menu-label">videos</p>
      <ul className="menu-list">
        {snapshots.map((s) => {
          const isActive = s.key === currentVideoKey;
          return (
            <li key={s.key}>
              <VideoListItem
                snapshot={s}
                isActive={isActive}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

const A = styled.a`
  display: inline-block !important;
  width: 80%;
`;
function VideoListItem({ snapshot, isActive, onSelect, onDelete }) {
  const videoId = snapshot.toJSON().videoType?.id;
  return (
    <>
      <A
        onClick={(e) => {
          onSelect(snapshot);
          e.preventDefault();
        }}
        href="#"
        className={isActive ? "is-active" : ""}
      >
        {videoId}
      </A>
      <button
        className="button is-small is-pulled-right"
        onClick={() => onDelete(snapshot.key)}
      >
        x
      </button>
    </>
  );
}

export default VideoList;
