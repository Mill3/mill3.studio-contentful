import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'

import { colors, fonts, fontSizes } from '@styles/Theme'


const SelectStyle = styled.select`
  appearance: none;
  border: none;
  border-bottom: 2px solid #D1D1D1;
  border-radius: 0;
  background: none;
  padding: 0 0.5em;
  width: auto;
  max-width: 100%;
  color: ${colors.black};
  font-family: ${fonts.serif};
  font-weight: 300;
  line-height: 1.48;
  flex: 1 1 auto;
  overflow: hidden;
  position: relative;
  transform: translateY(-10%);

  @media (max-width: ${props => props.theme.breakpoints[2]}) {
    text-align-last: center;
  }

  option {
    padding: 0;
    font-size: 1rem;
  }
`


const Select = forwardRef((props, ref) => (
  <Box as={SelectStyle} ref={ref} {...props} fontSize={[4,4,6]}>
    {props.children}
  </Box>
))

export default Select
