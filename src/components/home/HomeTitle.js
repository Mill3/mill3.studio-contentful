import React from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'

const HomeTitleStyle = styled.h2`
  text-transform: uppercase;
  transform-origin: top center;
`

const HomeTitle = ({ children, ...props }) => (
  <Text
    as={HomeTitleStyle}
    fontFamily={'serif'}
    fontSize={['9.2vw', null, '10.416666667vw', null, '10.833333333vw']}
    fontWeight={'300'}
    m={0}
    p={0}
    {...props}
  >{children}</Text>
)

export default HomeTitle
