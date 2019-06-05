import React from 'react'
import { Field } from 'react-final-form'
import styled from 'styled-components'

import { colors } from '@styles/Theme'


const CheckboxStyle = styled(Field)`
  appearance: none;
  margin: 0 1em 0 0;
  width: 28px;
  height: 28px;
  background: none;
  border: 2px solid ${colors.blue};
  border-radius: 100%;
  cursor: pointer;
  outline: none;

  &:checked {
    background: ${colors.blue};
    background: radial-gradient(circle, ${colors.blue} 50%, rgba(52, 38, 241, 0) 55%);
  }
`

const Checkbox = (props) => (
  <CheckboxStyle component="input" type="checkbox" {...props} />
)

export default Checkbox
