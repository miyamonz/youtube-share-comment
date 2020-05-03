import React, { useState } from "react";
import { db } from "./firebase";

import styled from "styled-components";

const FieldHasAddons = styled.div.attrs({ className: `field has-addons` })``;
const Control = styled.div.attrs({ className: `control` })``;
const Button = styled.button.attrs({ className: `button is-light` })``;
const Input = styled.input.attrs({ className: `input` })``;

function CreateRoomInput({ rooms }) {
  const [name, setName] = useState("");

  const onClick = () => {
    db.ref("rooms")
      .child(name)
      .set({ name, createdAt: Date.now() })
      .then(setName(""));
  };

  return (
    <FieldHasAddons>
      <Control>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Control>
      <Button onClick={onClick} disabled={name == ""}>
        create room
      </Button>
    </FieldHasAddons>
  );
}

export default CreateRoomInput;
