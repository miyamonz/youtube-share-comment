import React, { useState, useEffect } from "react";
import MyInput from "../MyInput";
import { useRoomContext } from "./ContextRoom";

export default function CommentArea({ comments, commentRef }) {
  const {
    val: { isPlaying, startAt, stopAt },
    ref: roomRef,
  } = useRoomContext();
  function clickTime(time) {
    roomRef.child("seekTo").set(time);
  }
  function sendComment(text) {
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
              <a onClick={() => clickTime(c.time)} href="javascript:void(0)">
                {mm}:{ss}
              </a>
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
      <MyInput onEnter={sendComment} />
    </div>
  );
}
