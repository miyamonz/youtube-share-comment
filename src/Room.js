import React, { useState, useEffect } from "react";
import Youtube from "react-youtube";

import { db } from "./firebase";
import { useObject } from "react-firebase-hooks/database";
import { Link, useParams } from "react-router-dom";

import CommentArea from "./CommentArea";

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
    seekTo,
  } = snapshots.val();
  const [player, setPlayer] = useState(null);
  const onReady = (event) => {
    setPlayer(event.target);
    const currentTime = isPlaying ? (Date.now() - startAt) / 1000 : stopAt;
    if (isPlaying) event.target.seekTo(currentTime);
    else event.target.seekTo(currentTime).pauseVideo();
  };

  useEffect(() => {
    if (player && seekTo) {
      console.log(seekTo);
      player.seekTo(seekTo);
      roomRef.child("seekTo").set(null);
    }
  }, [player, seekTo]);
  useEffect(() => {
    if (player) {
      isPlaying ? player.playVideo() : player.pauseVideo();
    }
  }, [isPlaying]);

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

  function onEnter(id) {
    roomRef.child("videoId").set(id);
    roomRef.child("isPlaying").set(false);
    roomRef.child("startAt").set(Date.now());
    roomRef.child("stopAt").set(0);
  }
  return (
    <>
      room: {name}
      <br />
      <Input defaultVal={videoId} onEnter={onEnter} />
      {videoId && (
        <div>
          <Youtube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            style={{ width: "100%" }}
          />
          {player && (
            <>
              <Seekbar roomRef={roomRef} player={player} />
              <ToggleButton
                roomRef={roomRef}
                isPlaying={isPlaying}
                disabled={!player}
                player={player}
              />
            </>
          )}
        </div>
      )}
      <CommentArea
        comments={comments}
        commentRef={roomRef.child("comments")}
        snapshotsVal={snapshots.val()}
      />
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
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {isPlaying ? "Puase" : "Play"}
    </button>
  );
}

function Seekbar({ player, roomRef }) {
  const duration = player.getDuration();

  const [updated, setUpdated] = useState();
  const [time, setTime] = useState(() => player.getCurrentTime());

  useEffect(() => {
    let id = setTimeout(() => {
      setTime(player.getCurrentTime());
      setUpdated([]);
    }, 100);
    return () => clearTimeout(id);
  }, [time, updated]);

  function onChange(e) {
    const val = parseFloat(e.target.value, 10);
    roomRef.child("seekTo").set(val);
    roomRef.child("startAt").set(Date.now());
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
