import React, { useState, useContext } from "react";

import { db } from "../firebase";
import { useObject } from "react-firebase-hooks/database";

import { Duration } from "luxon";

export const Context = React.createContext();

export function useRoomContext() {
  return useContext(Context);
}

export const Provider = ({ children, name }) => {
  const ref = db.ref(`rooms/${name}`);
  const [snapshots, loading, error] = useObject(ref);

  if (loading) return <span>"loading room"</span>;

  function getCurrentTime() {
    const { isPlaying, startAt, stopAt } = snapshots.val();
    const _ =
      (isPlaying
        ? (Date.now() - startAt.currentTime) / 1000 + startAt.playTime
        : stopAt?.playTime) || 0;

    return Duration.fromMillis(_ * 1000);
  }

  function seekTo(seconds) {
    const { isPlaying } = snapshots.val();
    ref.child("seekToTime").set(seconds);
    ref
      .child(isPlaying ? "startAt" : "stopAt")
      .set({ currentTime: Date.now(), playTime: seconds });
  }

  const value = {
    val: snapshots.val(),
    getCurrentTime,
    seekTo,
    snapshots,
    ref,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
