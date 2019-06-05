import React from 'react'
import { Field } from 'react-final-form'
import styled from 'styled-components'

import { colors, fonts, fontSizes } from '@styles/Theme'



const InputStyle = styled(Field)`
  color: ${colors.black};
  background: none;
  border: none;
  border-bottom: 1px solid #D1D1D1;
  padding: 0.3em 0.9em;
  font-size: ${fontSizes[4]}px;
  font-family: ${fonts.sans};
  font-weight: 300;
  width: 100%;

  &::placeholder {
    color: #D1D1D1;
  }
`

const Input = (props) => {
  return (
    <InputStyle component="input" type="text" {...props} />
  )
}

export default Input
