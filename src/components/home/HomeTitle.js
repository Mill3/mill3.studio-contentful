import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'

export const HomeTitleStyle = styled.h2`
  font-family: ${props => props.theme.fonts.serif};
  font-size: 156px;
  font-weight: 300;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
  transform-origin: top center;
`

const HomeTitle = ({ children, ...props }) => (
  <Text as={HomeTitleStyle} {...props}>{children}</Text>
)

export default HomeTitle
