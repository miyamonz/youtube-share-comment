import React, { useState, useEffect } from "react";

export default function MyInput({ defaultVal = "", onEnter, ...props }) {
  const [value, setValue] = useState(defaultVal);

  function onClick() {
    onEnter(value);
    setValue("");
  }
  const [downKeyCode, setDownKeyCode] = useState();
  function onKeyDown(e) {
    setDownKeyCode(e.keyCode);
  }
  const [upKeyCode, setUpKeyCode] = useState();
  function onKeyUp(e) {
    setUpKeyCode(e.keyCode);
  }

  useEffect(() => {
    if (upKeyCode === 13 && downKeyCode === 13) onClick();
  }, [downKeyCode, upKeyCode]);
  return (
    <>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        {...props}
      />
    </>
  );
}
