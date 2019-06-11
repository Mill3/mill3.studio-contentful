import React, { forwardRef } from 'react'
import styled from 'styled-components'

import { colors, fonts, fontSizes } from '@styles/Theme'


const InputStyle = styled.input`
  color: ${colors.black};
  background: none;
  border: none;
  border-bottom: 1px solid #D1D1D1;
  padding: 0.3em 0.9em;
  font-size: ${fontSizes[4]}px;
  font-family: ${fonts.sans};
  font-weight: 300;
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
    <InputStyle ref={ref} type="text" {...props} />
  )
})

export default Input
