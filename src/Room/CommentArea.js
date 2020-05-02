import React, { useState, useEffect } from "react";
import MyInput from "../MyInput";

import { Duration } from "luxon";

export default function CommentArea({ context }) {
  const {
    getCurrentTime,
    seekTo,
    val: { comments = [] },
    dbRef,
  } = context();

  const commentRef = dbRef.child("comments");

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
