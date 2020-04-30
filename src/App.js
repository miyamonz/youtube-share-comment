import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { useObject } from "react-firebase-hooks/database";

const db = firebase.database();

export default function App() {
  // db.ref("now").set(Date.now());
  db.ref("videoId").set("XxVg_s8xAms");

  const [snapshots, loading, error] = useObject(db.ref());
  return (
    <>
      <div>
        {error && <strong>Error</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && (
          <>
            <span>{JSON.stringify(snapshots.val())}</span>
            <br />
            <Loaded snapshots={snapshots} />
          </>
        )}
      </div>
    </>
  );
}

function Loaded({ snapshots }) {
  const roomsSnapshot = snapshots.child("rooms");
  const rooms = roomsSnapshot.val();
  return (
    <>
      <ul>
        {rooms &&
          rooms.map((room) => <li key={room.createdAt}>{room.name}</li>)}
      </ul>
      <CreateRoomButton snapshot={roomsSnapshot} />
      <button onClick={() => db.ref("rooms").set(null)}>clear rooms</button>
    </>
  );
}

function CreateRoomButton({ snapshot }) {
  const [name, setName] = useState("");

  const onClick = () => {
    const len = snapshot.val()?.length ?? 0;
    db.ref("rooms")
      .child(len)
      .set({ name, createdAt: Date.now() })
      .then(setName(""));
  };

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={onClick} disabled={name == ""}>
        create room
      </button>
    </>
  );
}
