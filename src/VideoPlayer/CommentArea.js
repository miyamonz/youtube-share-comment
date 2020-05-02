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
    commentRef.push({
      text,
      milli: time.milliseconds,
    });
  }

  function deleteComment(key) {
    commentRef.child(key).remove();
  }

  const _comments = Object.entries(comments)
    .map(([key, values]) => ({
      key,
      ...values,
    }))
    .sort((a, b) => a.milli < b.milli);

  return (
    <div>
      {_comments.map((c) => {
        const dur = Duration.fromMillis(c.milli);
        const onClick = () => clickTime(dur.as("seconds"));
        const timeStr = dur.toFormat("mm:ss");
        return (
          <div key={c.key}>
            <span>
              <a onClick={(e) => (onClick(), e.preventDefault())} href="#">
                {timeStr}
              </a>
            </span>
            {"\t"}
            <span>{c.text}</span>
            {"\t"}
            <span>
              <button onClick={() => deleteComment(c.key)}>x</button>
            </span>
          </div>
        );
      })}
      <MyInput onEnter={sendComment} />
    </div>
  );
}
