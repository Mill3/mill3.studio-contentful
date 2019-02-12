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
  mix-blend-mode: difference;
  a {
    color: white;
    display: inline-block;
  }
`

const NavItem = styled.li`
  padding: 0 1.5vw;
  margin: 0;
  flex: 0 0 auto;
`

const fontSizes = [4,4,`2vw`,`1.25vw`]

const Nav = ({ inverted }) => {
  return (
    <NavContainer inverted={inverted}>

      <NavItem>
        <TransitionLinkComponent to={`/projects/`} title={`Work, work, work, work!`} color={`#000`}>
          <Text fontSize={fontSizes}>
            <FormattedMessage id="Work" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      <NavItem>
        <TransitionLinkComponent to={`/about/`} title={`Yes, us`} color={`#445533`}>
          <Text fontSize={fontSizes}>
            <FormattedMessage id="About" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      {/* <NavItem>
        <TransitionLinkComponent to={`/about/`}>
          <Text fontSize={fontSizes}>
            <FormattedMessage id="Journal" />
          </Text>
        </TransitionLinkComponent>
      </NavItem> */}

      <NavItem>
        <TransitionLinkComponent to={`/contact/`} title={`🤙`} color={`#3426F1`}>
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