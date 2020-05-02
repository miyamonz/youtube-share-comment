import React, { useEffect } from "react";
import { useRoomContext } from "../ContextRoom";

export function useSeekEffect(player) {
  const {
    val: { seekToTime },
    ref: roomRef,
  } = useRoomContext();

  useEffect(() => {
    if (player && seekToTime) {
      player.seekTo(seekToTime);
      roomRef.child("seekToTime").set(null);
    }
  }, [player, seekToTime]);
}

export function usePlayEffect(player) {
  const {
    val: { isPlaying },
  } = useRoomContext();

  useEffect(() => {
    if (player) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }
  }, [isPlaying, player]);
}
