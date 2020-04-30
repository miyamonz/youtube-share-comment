import React, { useState, useEffect } from "react";
import MyInput from "./MyInput";

import { DateTime } from "luxon";

export default function ChatArea({ chats, chatRef, snapshotsVal }) {
  function onEnter(text) {
    const time = Date.now();
    chatRef.child(time).set({
      username: "miyamonz",
      icon:
        "https://i.gyazo.com/thumb/100/f2ec5d4f2ac2c0cdd32819330acc36e3-png.png",
      text,
      time,
    });
  }
  return (
    <div style={{ height: "100%" }}>
      <h3>chat</h3>
      <div style={{ overflow: "scroll" }}>
        {Object.values(chats).map((c) => {
          const date = DateTime.fromMillis(c.time);
          const dateStr = date.toFormat("HH:mm");
          return (
            <div className="divide-y divide-blue-100" key={c.time}>
              <span>{dateStr}</span>
              {"\t"}
              <span>{c.text}</span>
              {"\t"}
              <span>
                <img src={c.icon} style={{ width: 20 }} />
              </span>
            </div>
          );
        })}
      </div>
      <MyInput onEnter={onEnter} />
    </div>
  );
}
