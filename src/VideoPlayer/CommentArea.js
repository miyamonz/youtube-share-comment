import React, { useState, useEffect } from "react";
import { Duration } from "luxon";
import styled from "styled-components";

import MyInput from "../MyInput";

function CommentArea({ context }) {
  const {
    getCurrentTime,
    seekTo,
    val: { comments = [] },
    dbRef,
  } = context();

  const commentRef = dbRef.child("comments");

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

  const _comments = Object.entries(comments).map(([key, values]) => ({
    key,
    ...values,
  }));
  _comments.sort((a, b) => (a.milli < b.milli ? -1 : 1));

  return (
    <div>
      {_comments.reduce((prev, c) => {
        const dur = Duration.fromMillis(c.milli);
        const onClick = () => seekTo(dur.as("seconds"));
        const timeStr = dur.toFormat("mm:ss");
        const diff = (c.milli - (prev[prev.length - 1]?.milli ?? 0)) / 1000;
        const _ = (
          <div key={c.key} style={{ marginTop: diff / 5 }}>
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
        return [...prev, _];
      }, [])}
    </div>
  );
}

const Scroll = styled.div`
  height: 40vh;
  overflow: auto;
`;
function CommentAreaLayout(props) {
  const { getCurrentTime, dbRef } = props.context();
  const commentRef = dbRef.child("comments");

  function sendComment(text) {
    const time = getCurrentTime();
    commentRef.push({
      text,
      milli: time.milliseconds,
    });
  }
  return (
    <div>
      <Scroll>
        <CommentArea {...props} />
      </Scroll>
      <MyInput onEnter={sendComment} />
    </div>
  );
}

export default CommentAreaLayout;
