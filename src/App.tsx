import React, { useState } from "react";
import { useObject } from "react-firebase-hooks/database";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";

import Room from "./Room/index";
import Header from "./Header";
import CreateRoomInput from "./CreateRoomInput";

import { db } from "./firebase";

export default function App() {
  const [loading, error] = useObject(db.ref());
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

const Section = styled.div.attrs({ className: `section` })`
  padding: 1.5rem;
`;

function AppRouter() {
  return (
    <Router>
      <Header />
      <Section>
        <Switch>
          <Route path="/" exact children={<Home />} />
          <Route path="/rooms/:name" exact>
            <Room />
          </Route>
          <Route path="/rooms/:name/view" exact>
            <Room mode="view" />
          </Route>
        </Switch>
      </Section>
    </Router>
  );
}

const RoomLink = ({ name, ...props }) => {
  return (
    <Link to={`/rooms/${name}`} {...props}>
      {name}
    </Link>
  );
};
const RoomLinkStyled = styled(RoomLink).attrs({ className: `list-item` })``;
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

  return (
    <>
      <h2 className="title">rooms</h2>
      <div className="list is-hoverable">
        {rooms &&
          rooms.map((room) => (
            <RoomLinkStyled key={room.createdAt} name={room.name} />
          ))}
      </div>
      <br />
      <CreateRoomInput rooms={rooms} />
    </>
  );
}
