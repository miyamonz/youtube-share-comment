import React from "react";
import styled from "styled-components";

function ToggleButton({ onClick, isPlaying, disabled = true, ...props }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} {...props}>
      {isPlaying ? "Pause" : "Play"}
    </button>
  );
}

const Styled = styled(ToggleButton)`
  font-size: 30px;
  width: 100px;
`;

export default Styled;
