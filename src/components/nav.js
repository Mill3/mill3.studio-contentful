import React from 'react'
import LocalizedLink from '@utils/LocalizedLink'
import styled, { css } from 'styled-components'
import { Text } from 'rebass'
import { injectIntl, FormattedMessage } from 'react-intl'
import TransitionLink from 'gatsby-plugin-transition-link'

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
        <TransitionLink
          to={`/en/about/`}
          exit={{
            length: 0.25,
            delay: 0.5
          }}
          entry={{
            length: 0.25,
            delay: 0.5
          }}
        >
          <Text fontSize={[2,2,3]}>
            <FormattedMessage id="Work" />
          </Text>
        </TransitionLink>
      </NavItem>

      <NavItem>
        <LocalizedLink to={`/about/`}>
          <Text fontSize={[2,2,3]}>
            <FormattedMessage id="About" />
          </Text>
        </LocalizedLink>
      </NavItem>

      <NavItem>
        <LocalizedLink to={`/about/`}>
          <Text fontSize={[2,2,3]}>
            <FormattedMessage id="Journal" />
          </Text>
        </LocalizedLink>
      </NavItem>

      <NavItem>
        <LocalizedLink to={`/about/`}>
          <Text fontSize={[2,2,3]}>
            <FormattedMessage id="Let's talk" />
          </Text>
        </LocalizedLink>
      </NavItem>

      <NavItem>
        <Switcher />
      </NavItem>
    </NavContainer>
  );
}

export default injectIntl(Nav)