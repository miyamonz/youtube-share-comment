import React, { useState, useEffect } from "react";
import MyInput from "./MyInput";

import getVideoId from "get-video-id";

export default function URLInput({ defaultVal, onEnter }) {
  function _onEnter(text) {
    const videoType = getVideoId(text);
    onEnter(videoType);
  }
  return <MyInput defaultVal={defaultVal} onEnter={_onEnter} />;
}
