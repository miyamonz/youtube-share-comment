import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import Youtube from "react-youtube";

function Room({ videoId, isPlaying, comments = [], startAt, stopAt }) {
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
      <Youtube videoId={videoId} opts={opts} onReady={onReady} />
      <div>
        {c.map(([ms, data]) => (
          <div key={ms}>{JSON.stringify(data)}</div>
        ))}
      </div>
      <ToggleButton isPlaying={isPlaying} disabled={!player} player={player} />
    </>
  );
}

function ToggleButton({ isPlaying, disabled = true, player }) {
  const onClick = () => {
    db.ref("isPlaying").set(!isPlaying);
    if (!isPlaying) db.ref("startAt").set(Date.now());
    if (isPlaying) db.ref("stopAt").set(player.getCurrentTime());
    console.log(player);
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {isPlaying ? "Puase" : "Play"}
    </button>
  );
}

function CommentArea({ comments }) {}
