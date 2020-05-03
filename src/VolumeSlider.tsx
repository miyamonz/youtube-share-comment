import React, { useState, useEffect } from "react";

function SoundVolumeSlider({ state }) {
  const [volume, setVolume] = state;
  function onChange(e) {
    const v = e.target.value;
    setVolume(v);
  }

  return (
    <input type="range" min="0" max="100" value={volume} onChange={onChange} />
  );
}

export default SoundVolumeSlider;
