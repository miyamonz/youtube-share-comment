import React, { useState, useEffect } from "react";
import { useObject } from "react-firebase-hooks/database";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Room from "./Room/index.js";

import { db } from "./firebase";

import Header from "./Header";

export default function App() {
  const [snapshots, loading, error] = useObject(db.ref());
  return (
    <>
      <div>
        {error && (console.error(error), (<strong>Error</strong>))}
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
        <Header />

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
  let rooms;
  try {
    rooms = Object.values(roomsSnapshot.val());
  } catch {
    // there is no rooms
  }
  const RoomLink = ({ name }) => {
    return (
      <Link
        className="text-blue-600 visited:text-purple-600 "
        to={`/rooms/${name}`}
      >
        {name}
      </Link>
    );
  };
  return (
    <>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="w-1/2 px-4 py-2">rooms</th>
          </tr>
        </thead>
        <tbody>
          {rooms &&
            rooms.map((room) => (
              <tr key={room.createdAt}>
                <td className="border px-4 py-2">
                  <RoomLink {...room} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <br />
      <CreateRoomButton snapshot={roomsSnapshot} />
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
