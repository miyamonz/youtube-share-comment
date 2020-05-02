import React, { useState, useEffect } from "react";

export default function MyInput({ defaultVal = "", onEnter }) {
  const [value, setValue] = useState(defaultVal);

  function onClick() {
    onEnter(value);
    setValue("");
  }
  return (
    <>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={onClick}>send</button>
    </>
  );
}
