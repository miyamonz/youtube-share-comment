import React, { useState, useEffect } from "react";
import Youtube from "react-youtube";
import { useRoomContext } from "./ContextRoom";

export default function VideoPlayer({ videoId }) {
  const {
    getCurrentTime,
    val: { seekToTime, isPlaying },
    ref: roomRef,
  } = useRoomContext();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (player && seekToTime) {
      player.seekTo(seekToTime);
      roomRef.child("seekToTime").set(null);
    }
  }, [player, seekToTime]);

  useEffect(() => {
    if (player) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }
  }, [isPlaying, player]);

  const opts = {
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      disablekb: 1,
    },
  };
  const onReady = (event) => {
    setPlayer(event.target);
    const seconds = getCurrentTime().seconds;
    if (isPlaying) event.target.seekTo(seconds);
    else event.target.seekTo(seconds).pauseVideo();
  };
  return (
    <>
      <Youtube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        style={{ width: "100%" }}
      />
      {player && (
        <div style={{ display: "flex" }}>
          <ToggleButton
            roomRef={roomRef}
            isPlaying={isPlaying}
            player={player}
            disabled={!player}
          />
          <div style={{ flex: 1 }}>
            <Seekbar roomRef={roomRef} isPlaying={isPlaying} player={player} />
          </div>
          <div>
            <PlayTime />
          </div>
        </div>
      )}
    </>
  );
}

function ToggleButton({ roomRef, isPlaying, disabled = true, player }) {
  const onClick = () => {
    roomRef.child("isPlaying").set(!isPlaying);
    // start
    if (!isPlaying)
      roomRef
        .child("startAt")
        .set({ currentTime: Date.now(), playTime: player.getCurrentTime() });
    //stop
    if (isPlaying)
      roomRef
        .child("stopAt")
        .set({ currentTime: Date.now(), playTime: player.getCurrentTime() });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ fontSize: 30, width: "100px" }}
    >
      {isPlaying ? "Puase" : "Play"}
    </button>
  );
}

function Seekbar({ player, roomRef, isPlaying }) {
  const {
    seekTo,
    val: { seekToTime },
  } = useRoomContext();
  const duration = player.getDuration();

  const [updated, setUpdated] = useState();
  const [time, setTime] = useState(() => player.getCurrentTime());

  useEffect(() => {
    if (isPlaying) {
      let id = setTimeout(() => {
        setTime(player.getCurrentTime());
        setUpdated([]);
      }, 100);
      return () => clearTimeout(id);
    }
  }, [time, updated, isPlaying]);

  useEffect(() => {
    setTime(seekToTime);
  }, [seekToTime]);

  function onChange(e) {
    const val = parseFloat(e.target.value, 10);
    seekTo(val);
    setTime(val);
  }
  return (
    <input
      type="range"
      max={duration}
      step={0.1}
      style={{ width: "100%" }}
      value={time}
      onChange={onChange}
    />
  );
}

function useTick(ms = 1000) {
  const [update, setUpdate] = useState(null);
  const forceUpdate = () => setUpdate(Date.now());
  useEffect(() => {
    let id = setTimeout(forceUpdate, ms);
    return () => clearTimeout(id);
  }, [update]);
  return [update, forceUpdate];
}

function PlayTime() {
  const {
    getCurrentTime,
    val: { isPlaying, seekToTime },
  } = useRoomContext();

  const [updated] = useTick(1000);
  const [time, setTime] = useState(() => getCurrentTime());
  console.log(time.as("seconds"));

  useEffect(() => {
    setTime(getCurrentTime());
  }, [isPlaying, seekToTime, updated]);

  return <span>{time.toFormat("mm:ss")}</span>;
}
