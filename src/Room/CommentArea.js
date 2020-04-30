import React, { useState, useEffect } from "react";
import MyInput from "../MyInput";

export default function CommentArea({ comments, commentRef, snapshotsVal }) {
  const { isPlaying, startAt, stopAt } = snapshotsVal;
  function onEnter(text) {
    const currentTime = isPlaying ? (Date.now() - startAt) / 1000 : stopAt;
    const time = Math.floor(currentTime * 100) / 100;
    const curInt = parseInt(time * 100, 10);
    commentRef.child(curInt).set({
      username: "miyamonz",
      icon:
        "https://i.gyazo.com/thumb/100/f2ec5d4f2ac2c0cdd32819330acc36e3-png.png",
      text,
      time,
    });
  }

  return (
    <div>
      {Object.values(comments).map((c) => {
        const mm = Math.floor(c.time / 60);
        const ss = Math.floor(c.time - mm * 60);
        return (
          <div key={c.time}>
            <span>
              {mm}:{ss}
            </span>
            {"\t"}
            <span>{c.text}</span>
            {"\t"}
            <span>
              <img src={c.icon} style={{ width: 30 }} />
            </span>
          </div>
        );
      })}
      <MyInput onEnter={onEnter} />
    </div>
  );
}
