import React from "react";
import MyInput from "../MyInput";
import styled from "styled-components";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FieldHasAddons = styled.div.attrs({ className: `field has-addons` })``;
const Control = styled.div.attrs({ className: `control` })``;

function CommentInput({ onEnter, onClickPin }) {
  return (
    <FieldHasAddons>
      <button className="button is-info" onClick={onClickPin}>
        <FontAwesomeIcon icon={faMapPin} />
      </button>
      <Control>
        <MyInput onEnter={onEnter} placeholder="write comment" />
      </Control>
    </FieldHasAddons>
  );
}

export default CommentInput;
