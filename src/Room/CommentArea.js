import React, { useState, useEffect } from "react";
import MyInput from "../MyInput";
import { useRoomContext } from "./ContextRoom";

import { Duration } from "luxon";

export default function CommentArea({ comments, commentRef }) {
  const { getCurrentTime, seekTo, ref: roomRef } = useRoomContext();

  function clickTime(seconds) {
    seekTo(seconds);
  }
  function sendComment(text) {
    const time = getCurrentTime();
    const milliInt = parseInt(time.milliseconds, 10);
    commentRef.child(milliInt).set({
      text,
      milli: time.milliseconds,
    });
  }

  return (
    <div>
      {Object.values(comments).map((c) => {
        const dur = Duration.fromMillis(c.milli);
        const timeStr = dur.toFormat("mm:ss");
        return (
          <div key={c.milli}>
            <span>
              <a
                onClick={(e) => {
                  clickTime(dur.as("seconds")), e.preventDefault();
                }}
                href="#"
              >
                {timeStr}
              </a>
            </span>
            {"\t"}
            <span>{c.text}</span>
          </div>
        );
      })}
      <MyInput onEnter={sendComment} />
    </div>
  );
}
