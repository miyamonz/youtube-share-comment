import React, { useState, useEffect } from "react";
import MyInput from "../MyInput";
import { DateTime } from "luxon";

import styled from "styled-components";

function ChatArea({ chats: _chats }) {
  const chats = Object.values(_chats);
  return (
    <>
      {chats.map((c) => {
        const date = DateTime.fromMillis(c.time);
        const dateStr = date.toFormat("HH:mm");
        return (
          <div key={c.time}>
            <span>{dateStr}</span>
            {"\t"}
            <span>{c.text}</span>
          </div>
        );
      })}
    </>
  );
}

const MaxHeight = styled.div`
  height: 100%;
`;
const Scroll = styled.div`
  height: 100%;
  overflow: auto;
`;

function Container({ chatRef, ...props }) {
  function onEnter(text) {
    const time = Date.now();
    chatRef.child(time).set({
      text,
      time,
    });
  }
  return (
    <MaxHeight>
      <Scroll>
        <ChatArea {...props} />
      </Scroll>
      <MyInput onEnter={onEnter} />
    </MaxHeight>
  );
}

export default Container;
