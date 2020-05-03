import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav.attrs({ className: `navbar is-light` })``;
const NavbarBrand = styled.div.attrs({ className: `navbar-brand` })``;
const NavbarMenu = styled.div.attrs({ className: `navbar-menu` })``;
const NavbarStart = styled.div.attrs({ className: `navbar-start` })``;
const NavbarItem = styled.a.attrs({ className: `navbar-item` })``;
const NavbarLink = styled(Link).attrs({ className: `navbar-item` })``;

function Header() {
  return (
    <Nav>
      <NavbarBrand>
        <NavbarLink to="/">Home</NavbarLink>
      </NavbarBrand>
      <NavbarMenu></NavbarMenu>
    </Nav>
  );
}

export default Header;
