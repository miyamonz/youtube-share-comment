import React, { useState, useEffect } from "react";

function useTick(ms = 1000) {
  const [update, setUpdate] = useState(null);
  const forceUpdate = () => setUpdate(Date.now());
  useEffect(() => {
    let id = setTimeout(forceUpdate, ms);
    return () => clearTimeout(id);
  }, [update]);
  return [update, forceUpdate];
}

export default useTick;
