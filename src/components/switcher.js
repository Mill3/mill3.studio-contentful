import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { injectIntl } from 'react-intl'

import locales from '@locales'

const SwitcherLink = styled.a`
  display: ${props => props.hidden ? 'none' : 'inline-block'};
`

const Switcher = ({intl: { locale } }) => (
  <>
    {Object.keys(locales).map(key => (
      <SwitcherLink
        as={Link}
        hidden={key === locale ? true : false}
        key={locales[key].locale}
        to={`/${locales[key].path}/`}
      >
        {locales[key].locale}
      </SwitcherLink>
    ))}
  </>
);

export default injectIntl(Switcher)