import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'

import { colors, fonts } from '@styles/Theme'
import ARROW_DOWN from '@svg/select-arrow-down.svg'


const SelectStyle = styled.select`
  appearance: none;
  border: none;
  border-bottom: 2px solid #D1D1D1;
  border-radius: 0;
  background-color: transparent;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-position: top 55% right 0.5em;
  background-image: url(${ARROW_DOWN});
  background-size: 7% auto;
  padding: 0 0.5em;
  color: ${colors.black};
  font-family: ${fonts.serif};
  font-weight: 300;
  line-height: 1.48;
  overflow: hidden;
  position: relative;
  transform: translateY(3%);

  @media (max-width: ${props => props.theme.breakpoints[2]}) {
    text-align-last: center;
  }

  option {
    padding: 0;
    /* font-size: 1rem; */
  }
`


const Select = forwardRef((props, ref) => (
  <Box as={SelectStyle} ref={ref} {...props} fontSize={['7.729468599vw', null, '5.2vw', '3.611111111vw']}>
    {props.children}
  </Box>
))

export default Select
