import React, { memo } from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import TransitionLinkComponent from '@components/transitions/TransitionLink'

export const ClientNameHeading = styled.h4`
  display: inline-block;
  font-weight: 500;
  line-height: 1;
  text-transform: uppercase;

  a {
    color: black;
    
    &:hover {
      color: black;
      text-decoration: none;
    }
  }
`

const ClientName = ({ name }) => {
  return (
    <Text as={ClientNameHeading} fontSize={['12.5vw', 4, '8vw']} ml={[2, 4]} mr={[2, 4]}>
      <TransitionLinkComponent to={`/projects/`} color={`#000`}>
        <span>{name}</span>
      </TransitionLinkComponent>
    </Text>
  )
}

export default memo(ClientName);
