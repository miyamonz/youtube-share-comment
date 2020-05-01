import React, { useState, useEffect } from "react";
import MyInput from "../MyInput";

import { DateTime } from "luxon";

export default function ChatArea({ chats, chatRef, snapshotsVal }) {
  function onEnter(text) {
    const time = Date.now();
    chatRef.child(time).set({
      text,
      time,
    });
  }
  return (
    <div style={{ height: "100%" }}>
      <div style={{ overflow: "scroll" }}>
        {Object.values(chats).map((c) => {
          const date = DateTime.fromMillis(c.time);
          const dateStr = date.toFormat("HH:mm");
          return (
            <div className="divide-y divide-blue-100" key={c.time}>
              <span>{dateStr}</span>
              {"\t"}
              <span>{c.text}</span>
            </div>
          );
        })}
      </div>
      <MyInput onEnter={onEnter} />
    </div>
  );
}
