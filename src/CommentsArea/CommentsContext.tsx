import React, { useState, useContext } from "react";
import { useObject } from "react-firebase-hooks/database";

export const Context = React.createContext();

export function useCommentsContext() {
  return useContext(Context);
}

export const Provider = ({ dbRef, children }) => {
  const [snapshots, loading, error] = useObject(dbRef);
  if (loading) return <span>"loading comments"</span>;
  const value = {
    snapshots,
    dbRef,
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
