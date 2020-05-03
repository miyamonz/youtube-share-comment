import React, { useEffect } from "react";
import { useVideoContext } from "./VideoContext";

export function useSeekEffect(player) {
  const {
    val: { seekToTime },
    dbRef,
  } = useVideoContext();

  useEffect(() => {
    if (player && seekToTime) {
      player.seekTo(seekToTime);
      dbRef.child("seekToTime").set(null);
    }
  }, [player, seekToTime]);
}

export function usePlayEffect(player) {
  const {
    val: { isPlaying },
  } = useVideoContext();

  useEffect(() => {
    if (player) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }
  }, [isPlaying, player]);
}

export function useVolumeEffect(player) {
  const { volume } = useVideoContext();

  useEffect(() => {
    if (player) {
      player.setVolume(volume);
    }
  }, [player, volume]);
}
