import React, { useState, useEffect } from "react";
import Youtube from "react-youtube";

import { db } from "./firebase";
import { useObject } from "react-firebase-hooks/database";
import { Link, useParams } from "react-router-dom";

export default function Room() {
  const { name } = useParams();
  const ref = db.ref(`rooms/${name}`);
  const [snapshots, loading, error] = useObject(ref);
  return <>{snapshots && <RoomLoaded roomRef={ref} snapshots={snapshots} />}</>;
}

function RoomLoaded({ roomRef, snapshots }) {
  const {
    name,
    videoId,
    isPlaying,
    comments = [],
    startAt,
    stopAt,
  } = snapshots.val();
  const [player, setPlayer] = useState(null);
  const onReady = (event) => {
    setPlayer(event.target);
    const currentTime = (Date.now() - startAt) / 1000;
    if (isPlaying) event.target.seekTo(currentTime);
    else event.target.seekTo(stopAt).pauseVideo();
  };

  useEffect(() => {
    if (player) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }
  }, [isPlaying]);

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 0,
    },
  };

  const c = Object.entries(comments).map(([secStr, data]) => [
    parseInt(secStr, 10),
    data,
  ]);
  return (
    <>
      room: {name}
      <br />
      <Input
        defaultVal={videoId}
        onEnter={(id) => roomRef.child("videoId").set(id)}
      />
      {videoId && <Youtube videoId={videoId} opts={opts} onReady={onReady} />}
      <ToggleButton
        roomRef={roomRef}
        isPlaying={isPlaying}
        disabled={!player}
        player={player}
      />
      <div>
        {c.map(([ms, data]) => (
          <div key={ms}>{JSON.stringify(data)}</div>
        ))}
      </div>
    </>
  );
}

function Input({ defaultVal = "", onEnter }) {
  const [value, setValue] = useState(defaultVal);

  function onClick() {
    onEnter(value);
  }
  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={onClick}>send</button>
    </>
  );
}

function ToggleButton({ roomRef, isPlaying, disabled = true, player }) {
  const onClick = () => {
    roomRef.child("isPlaying").set(!isPlaying);
    if (!isPlaying) roomRef.child("startAt").set(Date.now());
    if (isPlaying) roomRef.child("stopAt").set(player.getCurrentTime());
    console.log(player);
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {isPlaying ? "Puase" : "Play"}
    </button>
  );
}
