import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Duration } from "luxon";

import { useRoomContext } from "../Room/ContextRoom";

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

  const commentsRef = dbRef.child("comments");

  function sendComment(text) {
    const time = getCurrentTime();
    commentsRef.push({
      text,
      milli: time.milliseconds,
    });
  }

  function deleteComment(key) {
    commentsRef.child(key).remove();
  }

  const _comments = Object.entries(comments).map(([key, values]) => ({
    key,
    ...values,
  }));
  _comments.sort((a, b) => (a.milli < b.milli ? -1 : 1));

  return (
    <div>
      {_comments.reduce((prev, comment) => {
        const commentRef = commentsRef.child(comment.key);
        const _ = (
          <div key={comment.key}>
            <CommentListItem
              {...{ comment, commentRef }}
              onClickTime={seekTo}
            />
          </div>
        );
        return [...prev, _];
      }, [])}
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
      <CommentText
        text={comment.text}
        onEnter={(text) => commentRef.update({ text })}
        onClickRemove={() => commentRef.rempve()}
      />
    </>
  );
}

const NotMaxWidthInput = styled(
  React.forwardRef((props, ref) => <MyInput {...props} innerRef={ref} />)
)`
  width: auto;
`;
function CommentText({ text, onEnter, onClickRemove }) {
  const { mode } = useRoomContext();
  const [editing, setEditing] = useState(false);

  const ref = useRef();
  useEffect(() => {
    if (editing) ref.current.focus();
  }, [editing]);

  const _onEnter = (text) => {
    setEditing(false);
    onEnter(text);
  };
  return (
    <>
      {editing ? (
        <>
          <NotMaxWidthInput
            ref={ref}
            defaultVal={text}
            onEnter={_onEnter}
            onKeyDown={(e) => {
              if (e.key == "Escape") setEditing(false);
            }}
            onBlur={() => setEditing(false)}
          />
          <span>
            <button onClick={onClickRemove}>x</button>
          </span>
        </>
      ) : (
        <span
          onClick={() => {
            if (mode === "view") return;
            setEditing(true);
          }}
        >
          {text}
        </span>
      )}
    </>
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
  return (
    <div>
      {mode === "view" || <CommentInput onEnter={sendComment} />}
      <Scroll>
        <CommentArea {...props} />
      </Scroll>
    </div>
  );
}

const FieldHasAddons = styled.div.attrs({ className: `field has-addons` })``;
const Control = styled.div.attrs({ className: `control` })``;

function CommentInput({ onEnter }) {
  return (
    <FieldHasAddons>
      <button className="button is-info">
        <FontAwesomeIcon icon={faMapPin} />
      </button>
      <Control>
        <MyInput onEnter={onEnter} placeholder="write comment" />
      </Control>
    </FieldHasAddons>
  );
}

export default CommentAreaLayout;
