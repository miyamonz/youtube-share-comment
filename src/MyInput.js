import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Input = styled.input.attrs({ className: `input is-info` })``;
export default function MyInput({
  defaultVal = "",
  onEnter,
  onKeyDown,
  ...props
}) {
  const [value, setValue] = useState(defaultVal);

  function onClick() {
    onEnter(value);
    setValue("");
  }
  const [downKeyCode, setDownKeyCode] = useState();
  function _onKeyDown(e) {
    setDownKeyCode(e.keyCode);
    onKeyDown(e);
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
      <Input
        ref={props.innerRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={_onKeyDown}
        onKeyUp={onKeyUp}
        {...props}
      />
    </>
  );
}
