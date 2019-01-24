import React from 'react'
import LocalizedLink from '@utils/LocalizedLink'
import styled, { css } from 'styled-components'

import Switcher from '@components/switcher'

const NavContainer = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
`

const NavItem = styled.li`
  padding: 0 1.5vw;
  margin: 0;
  flex: 0 0 auto;
`

const Nav = () => {
  return (
    <NavContainer>
      <NavItem>
        <LocalizedLink to={`/work/`}>Work</LocalizedLink>
      </NavItem>
      <NavItem>
        <LocalizedLink to={`/about/`}>About</LocalizedLink>
      </NavItem>
      <NavItem>
        <LocalizedLink to={`/journal/`}>Journal</LocalizedLink>
      </NavItem>
      <NavItem>
        <LocalizedLink to={`/contact/`}>Let's talk</LocalizedLink>
      </NavItem>
      <NavItem>
        <Switcher />
      </NavItem>
    </NavContainer>
  );
}

export default Nav;