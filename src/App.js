import React, { useState, useEffect } from "react";
import { useObject } from "react-firebase-hooks/database";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Room from "./Room";

import { db } from "./firebase";

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
            <AppRouter />
          </>
        )}
      </div>
    </>
  );
}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact children={<Home />} />
          <Route path="/rooms/:name">
            <Room />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  const [snapshots, loading, error] = useObject(db.ref());
  if (loading) return [];
  const roomsSnapshot = snapshots.child("rooms");
  const rooms = Object.values(roomsSnapshot.val());
  const RoomLink = ({ name }) => {
    return <Link to={`/rooms/${name}`}>{name}</Link>;
  };
  return (
    <>
      <span>rooms</span>
      <ul>
        {rooms &&
          rooms.map((room) => (
            <li key={room.createdAt}>
              <RoomLink {...room} />
            </li>
          ))}
      </ul>
      <CreateRoomButton snapshot={roomsSnapshot} />
      <button onClick={() => db.ref("rooms").set(null)}>clear rooms</button>
    </>
  );
}

function CreateRoomButton({ snapshot }) {
  const [name, setName] = useState("");

  const onClick = () => {
    db.ref("rooms")
      .child(name)
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
