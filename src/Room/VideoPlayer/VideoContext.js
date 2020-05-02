import React, { useState, useContext } from "react";
import { useObject } from "react-firebase-hooks/database";
import { Duration } from "luxon";

export const Context = React.createContext();

export function useVideoContext() {
  return useContext(Context);
}

export const Provider = ({ dbRef, children }) => {
  const [snapshots, loading, error] = useObject(dbRef);
  if (loading) return <span>"loading video"</span>;

  function getCurrentTime() {
    const { isPlaying = false, startAt, stopAt } = snapshots.val() ?? {
      isPlaying,
    };
    const _ =
      (isPlaying
        ? (Date.now() - startAt.currentTime) / 1000 + startAt.playTime
        : stopAt?.playTime) || 0;

    return Duration.fromMillis(_ * 1000);
  }

  function seekTo(seconds) {
    const { isPlaying } = snapshots.val();
    dbRef.child("seekToTime").set(seconds);
    dbRef
      .child(isPlaying ? "startAt" : "stopAt")
      .set({ currentTime: Date.now(), playTime: seconds });
  }

  function togglePlay() {
    const { isPlaying } = snapshots.val();
    dbRef.child("isPlaying").set(!isPlaying);

    const param = {
      currentTime: Date.now(),
      playTime: getCurrentTime().as("seconds"),
    };
    if (!isPlaying) dbRef.child("startAt").set(param);
    if (isPlaying) dbRef.child("stopAt").set(param);
  }

  const value = {
    val: snapshots.val() ?? { isPlaying: false },
    getCurrentTime,
    seekTo,
    togglePlay,
    snapshots,
    dbRef,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
