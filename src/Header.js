import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <nav>
        <ul className="flex">
          <li className="mr-6">
            <Link className="text-blue-500 hover:text-blue-800" to="/">
              Home
            </Link>
          </li>
        </ul>
      </nav>
      room: {name}
    </>
  );
}
