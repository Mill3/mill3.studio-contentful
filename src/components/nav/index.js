import React from 'react'
import LocalizedLink from '@utils/LocalizedLink'
import styled, { css } from 'styled-components'
import { Text } from 'rebass'
import { injectIntl, FormattedMessage } from 'react-intl'

import Switcher from '@components/nav/switcher'
import TransitionLinkComponent from '@utils/TransitionLink'

const NavContainer = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-self: center;
  justify-content: center;
  a {
    color: ${props => props.inverted ? `${props.theme.colors.white}` : `${props.theme.colors.black}`};
    display: inline-block;
  }
`

const NavItem = styled.li`
  padding: 0 1.5vw;
  margin: 0;
  flex: 0 0 auto;
`

const fontSizes = [2,2,`2vw`,`1.25vw`]

const Nav = ({ inverted }) => {
  return (
    <NavContainer inverted={inverted}>

      <NavItem>
        <TransitionLinkComponent to={`/about/`}>
          <Text fontSize={fontSizes}>
            <FormattedMessage id="Work" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      <NavItem>
        <TransitionLinkComponent to={`/about/`}>
          <Text fontSize={fontSizes}>
            <FormattedMessage id="About" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      <NavItem>
        <TransitionLinkComponent to={`/about/`}>
          <Text fontSize={fontSizes}>
            <FormattedMessage id="Journal" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      <NavItem>
        <TransitionLinkComponent to={`/contact/`}>
          <Text fontSize={fontSizes}>
            <FormattedMessage id="Let's talk" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      <NavItem>
        <Switcher fontSizes={fontSizes} />
      </NavItem>

    </NavContainer>
  );
}

export default injectIntl(Nav)