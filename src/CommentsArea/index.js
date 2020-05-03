import React from "react";

import { useRoomContext } from "../contexts";
import { Provider, useCommentsContext } from "./CommentsContext";

import CommentsList from "./CommentsList";
import MyInput from "../MyInput";

import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styled from "styled-components";

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
function CommentsAreaLayout(props) {
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
        <CommentsList {...props} />
      </Scroll>
    </Provider>
  );
}

export default CommentsAreaLayout;
