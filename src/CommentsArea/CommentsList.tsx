import React, { useState, useEffect } from "react";
import { Duration } from "luxon";

import { useRoomContext, useVideoContext } from "../contexts";
import { useCommentsContext } from "./CommentsContext";

import CommentEditableText from "./CommentEditableText";

function CommentsList() {
  const {
    getCurrentTime,
    seekTo,
    val: { comments = [] },
    dbRef,
  } = useVideoContext();
  const { dbRef: commentsRef } = useCommentsContext();

  const _comments = Object.entries(comments).map(([key, values]) => ({
    key,
    ...values,
  }));
  _comments.sort((a, b) => (a.milli < b.milli ? -1 : 1));

  return (
    <div>
      {_comments.map((comment) => {
        const commentRef = commentsRef.child(comment.key);
        return (
          <div key={comment.key}>
            <CommentListItem
              {...{ comment, commentRef }}
              onClickTime={seekTo}
            />
          </div>
        );
      })}
    </div>
  );
}

function CommentListItem({ comment, onClickTime, commentRef }) {
  const { mode } = useRoomContext();
  const dur = Duration.fromMillis(comment.milli);
  const timeStr = dur.toFormat("mm:ss");
  const onClick = () => {
    if (mode === "view") return;
    onClickTime(dur.as("seconds"));
  };
  return (
    <>
      <span>
        <a onClick={(e) => (onClick(), e.preventDefault())} href="#">
          {timeStr}
        </a>
      </span>
      {"\t"}
      <CommentEditableText
        text={comment.text}
        onEnter={(text) => commentRef.update({ text })}
        onClickRemove={() => commentRef.rempve()}
      />
    </>
  );
}

export default CommentsList;
