import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'

import { colors } from '@styles/Theme'


const InputStyle = styled.input`
  background: none;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid ${colors.blue};
  padding: 0.3em 0.9em;
  width: 100%;
  outline: none;

  &::placeholder {
    color: #D1D1D1;
  }
`

const Input = forwardRef((props, ref) => {
  return (
    <Text as={InputStyle} ref={ref} type="text" fontFamily="serifText" fontSize={['5.797101449vw', null, '3vw', '1.944444444vw']} textAlign="center" fontWeight={400} color={['blue', null, 'white']} {...props} />
  )
})

export default Input
