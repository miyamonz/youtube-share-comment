import React from "react";

import { useRoomContext, useVideoContext } from "../contexts";
import { Provider, useCommentsContext } from "./CommentsContext";

import CommentInput from "./CommentInput";
import CommentsList from "./CommentsList";

import styled from "styled-components";

const Scroll = styled.div`
  height: 40vh;
  overflow: auto;
`;
function CommentsAreaLayout() {
  const { mode } = useRoomContext();
  const { getCurrentTime, dbRef } = useVideoContext();
  const commentsRef = dbRef.child("comments");

  function sendComment(text) {
    if (text === "") return;
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
        <CommentsList />
      </Scroll>
    </Provider>
  );
}

export default CommentsAreaLayout;
