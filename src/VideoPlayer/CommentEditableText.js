import React, { useState, useEffect } from "react";
import { useRef } from "react";

import { useRoomContext } from "../Room/ContextRoom";

import MyInput from "../MyInput";

import styled from "styled-components";

const NotMaxWidthInput = styled(
  React.forwardRef((props, ref) => <MyInput {...props} innerRef={ref} />)
)`
  width: auto;
`;

export default function CommentEditableText({ text, onEnter, onClickRemove }) {
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
