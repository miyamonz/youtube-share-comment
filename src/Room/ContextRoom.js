import React, { useState, useContext } from "react";

import { db } from "../firebase";
import { useObject } from "react-firebase-hooks/database";

export const Context = React.createContext();

export function useRoomContext() {
  return useContext(Context);
}

export const Provider = ({ children, name }) => {
  const ref = db.ref(`rooms/${name}`);
  const [snapshots, loading, error] = useObject(ref);

  if (loading) return <span>"loading room"</span>;
  const value = {
    val: snapshots.val(),
    snapshots,
    ref,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
