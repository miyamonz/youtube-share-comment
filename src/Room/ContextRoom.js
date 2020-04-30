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

  if (loading) return "loading room";
  return (
    <Context.Provider value={[snapshots, ref]}>{children}</Context.Provider>
  );
};
