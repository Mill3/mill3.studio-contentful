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
        <TransitionLinkComponent to={`/about/`}>
          <Text fontSize={[2,2,3]}>
            <FormattedMessage id="Work" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      <NavItem>
        <TransitionLinkComponent to={`/about/`}>
          <Text fontSize={[2,2,3]}>
            <FormattedMessage id="About" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      <NavItem>
        <TransitionLinkComponent to={`/about/`}>
          <Text fontSize={[2,2,3]}>
            <FormattedMessage id="Journal" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      <NavItem>
        <TransitionLinkComponent to={`/contact/`}>
          <Text fontSize={[2,2,3]}>
            <FormattedMessage id="Let's talk" />
          </Text>
        </TransitionLinkComponent>
      </NavItem>

      <NavItem>
        <Switcher />
      </NavItem>

    </NavContainer>
  );
}

export default injectIntl(Nav)