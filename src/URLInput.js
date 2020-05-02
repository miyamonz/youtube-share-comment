import React, { useState, useEffect } from "react";
import MyInput from "./MyInput";

import getVideoId from "get-video-id";

export default function URLInput({ defaultVal, onChange }) {
  function onEnter(text) {
    const videoType = getVideoId(text);
    onChange(videoType);
  }
  return <MyInput defaultVal={defaultVal} onEnter={onEnter} />;
}
