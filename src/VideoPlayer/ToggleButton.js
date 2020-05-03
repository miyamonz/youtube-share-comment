import React from "react";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

function ToggleButton({ onClick, isPlaying, disabled = true, ...props }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} {...props}>
      <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
    </button>
  );
}

const Styled = styled(ToggleButton).attrs({ className: `button is-link` })``;

export default Styled;
