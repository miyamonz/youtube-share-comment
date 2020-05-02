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
      (isPlaying && !!startAt?.currentTime && !!startAt.playTime
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
    setPlay(!isPlaying);
  }
  function setPlay(bool) {
    dbRef.child("isPlaying").set(bool);

    const param = {
      currentTime: Date.now(),
      playTime: getCurrentTime().as("seconds"),
    };
    if (bool) dbRef.child("startAt").set(param);
    else dbRef.child("stopAt").set(param);
  }

  const value = {
    val: snapshots.val() ?? { isPlaying: false },
    getCurrentTime,
    seekTo,
    togglePlay,
    setPlay,
    snapshots,
    dbRef,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
