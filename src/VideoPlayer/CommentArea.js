import React, { useState, useEffect } from "react";
import { Duration } from "luxon";

import { useRoomContext } from "../contexts";
import { Provider, useCommentsContext } from "./CommentsContext";

import CommentEditableText from "./CommentEditableText.js";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styled from "styled-components";

import MyInput from "../MyInput";

function CommentArea({ context }) {
  const {
    getCurrentTime,
    seekTo,
    val: { comments = [] },
    dbRef,
  } = context();
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

const FieldHasAddons = styled.div.attrs({ className: `field has-addons` })``;
const Control = styled.div.attrs({ className: `control` })``;

function CommentInput({ onEnter, onClickPin }) {
  return (
    <FieldHasAddons>
      <button className="button is-info" onClick={onClickPin}>
        <FontAwesomeIcon icon={faMapPin} />
      </button>
      <Control>
        <MyInput onEnter={onEnter} placeholder="write comment" />
      </Control>
    </FieldHasAddons>
  );
}

const Scroll = styled.div`
  height: 40vh;
  overflow: auto;
`;
function CommentAreaLayout(props) {
  const { mode } = useRoomContext();
  const { getCurrentTime, dbRef } = props.context();
  const commentsRef = dbRef.child("comments");

  function sendComment(text) {
    const time = getCurrentTime();
    commentsRef.push({
      text,
      milli: time.milliseconds,
    });
  }
  function createCommentAndEdit() {
    const time = getCurrentTime();
    commentsRef.push({
      text: "",
      milli: time.milliseconds,
    });
  }
  return (
    <Provider dbRef={commentsRef}>
      {mode !== "view" && (
        <CommentInput onEnter={sendComment} onClickPin={createCommentAndEdit} />
      )}
      <Scroll>
        <CommentArea {...props} />
      </Scroll>
    </Provider>
  );
}

export default CommentAreaLayout;
