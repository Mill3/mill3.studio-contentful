import React from 'react'
import styled from 'styled-components'
import { injectIntl } from 'react-intl'
import { Text } from 'rebass'

import TransitionLinkComponent from '@components/transitions/TransitionLink'
import locales from '@locales/locales'

const SwitcherLink = styled.a`
  display: ${props => props.hidden ? 'none' : 'inline-block'};
`

const Switcher = ({intl: { locale }, fontSizes }) => (
  <>
    {Object.keys(locales).map(key => (
      <TransitionLinkComponent
        key={key}
        as={SwitcherLink}
        hidden={key === locale ? true : false}
        to={`/${locales[key].path}/`}
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
