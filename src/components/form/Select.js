import React from 'react'
import { Field } from 'react-final-form'
import styled from 'styled-components'

import { colors, fonts, fontSizes } from '@styles/Theme'


const SelectStyle = styled(Field)`
  appearance: none;
  border: none;
  border-bottom: 2px solid #D1D1D1;
  border-radius: 0;
  background: none;
  padding: 0 0.5em;
  width: auto;
  max-width: 100%;
  color: ${colors.black};
  font-size: ${fontSizes[6]}px;
  font-family: ${fonts.serif};
  font-weight: 300;
  line-height: 1.48;
  flex: 1 1 auto;
  overflow: hidden;

  option {
    padding: 0;
    font-size: 1rem;
  }
`


const Select = (props) => (
  <SelectStyle {...props} component="select">
    {props.children}
  </SelectStyle>
)

export default Select
