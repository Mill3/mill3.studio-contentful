import React from 'react'
import styled from 'styled-components'
import { injectIntl } from "gatsby-plugin-intl"
import { Text } from 'rebass'

import locales from '@locales/locales'

const SwitcherLink = styled.a`
  display: ${props => props.hidden ? 'none' : 'inline-block'};
`

const Switcher = (props) => {
  const { intl: { locale }, fontSizes } = props

  return(
    <>
      {Object.keys(locales).map(key => (
        <a
          key={key}
          as={SwitcherLink}
          hidden={key === locale ? true : false}
          href={`/${locales[key].path}/`}
          color={`#fff`}
        >
          <Text fontSize={fontSizes}>
            {locales[key].locale}
          </Text>
        </a>
      ))}
    </>
  )
};

export default injectIntl(Switcher)
