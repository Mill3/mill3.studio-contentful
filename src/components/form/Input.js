import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'

import { colors } from '@styles/Theme'


const InputStyle = styled.input`
  background: none;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #D1D1D1;
  padding: 0.3em 0.9em;
  width: 100%;
  outline: none;

  &::placeholder {
    color: #D1D1D1;
  }
  &:invalid {
    border-bottom-color: ${colors.blue};
  }
`

const Input = forwardRef((props, ref) => {
  return (
    <Text as={InputStyle} ref={ref} type="text" fontFamily="serif" fontSize={['5.797101449vw', null, 4]} fontWeight={300} color={['blue', null, 'black']} {...props} />
  )
})

export default Input
