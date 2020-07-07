import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import TransitionLinkComponent from '@components/transitions/TransitionLink'

export const ClientNameHeading = styled.h4`
  text-transform: uppercase;
  white-space: nowrap;

  a {
    color: black !important;
    text-decoration: none;
  }
`

const FONT_SIZES = ['12.5vw', 4, '8vw']
const MARGINS = [2, 4]

const ClientName = ({ name }) => {
  return (
    <Text as={ClientNameHeading} fontSize={FONT_SIZES} fontWeight={500} lineHeight={1} m={0} p={0} px={MARGINS}>
      <TransitionLinkComponent to={`/projects/`} color={`#000`}>{name}</TransitionLinkComponent>
    </Text>
  )
}

export default React.memo(ClientName);
