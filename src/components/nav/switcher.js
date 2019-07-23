import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { injectIntl } from 'react-intl'
import { Text } from 'rebass'

import TransitionLinkComponent from '@utils/TransitionLink'
import locales from '@locales/locales'

const SwitcherLink = styled.a`
  display: ${props => props.hidden ? 'none' : 'inline-block'};
`

const Switcher = ({intl: { locale }, fontSizes }) => (
  <>
    {Object.keys(locales).map(key => (
      <TransitionLinkComponent
        as={SwitcherLink}
        hidden={key === locale ? true : false}
        to={`/${locales[key].path}/`}
        title={`Click click..`}
        color={`#fff`}
        localePrefix={false}
      >
        <Text fontSize={fontSizes}>
          {locales[key].locale}
        </Text>
      </TransitionLinkComponent>
    ))}
  </>
);

export default injectIntl(Switcher)
