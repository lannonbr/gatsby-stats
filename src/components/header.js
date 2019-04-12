import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const StyledNav = styled.nav`
  ul {
    padding: 0;
    display: flex;
    list-style-type: none;
  }
  li:not(:first-child) {
    margin-left: 30px;
  }
`

const Header = props => (
  <header style={{ display: "flex", justifyContent: "space-between" }}>
    <h1>Gatsby Stats</h1>
    <StyledNav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/">Issues</Link>
        </li>
        <li>
          <Link to="/">Pull Requests</Link>
        </li>
        <li>
          <Link to="/stars/day/">Stars</Link>
        </li>
        <li>
          <Link to="/">Site Showcase Stats</Link>
        </li>
        <li>
          <Link to="/">Docs Stats</Link>
        </li>
      </ul>
    </StyledNav>
  </header>
)

export default Header
