import React, { forwardRef } from 'react'
import styled from 'styled-components'

import { colors } from '@styles/Theme'


const CheckboxStyle = styled.input`
  appearance: none;
  margin: 0 1em 0 0;
  width: 28px;
  height: 28px;
  background: none;
  border: 2px solid ${colors.blue};
  border-radius: 100%;
  cursor: pointer;
  outline: none;
  flex: 0 0 auto;

  &:checked {
    background: ${colors.blue};
    background: radial-gradient(circle, ${colors.blue} 50%, rgba(52, 38, 241, 0) 55%);
  }
`

const Checkbox = forwardRef((props, ref) => (
  <CheckboxStyle ref={ref} type="checkbox" {...props} />
))

export default Checkbox
