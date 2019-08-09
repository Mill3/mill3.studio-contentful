import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Box } from 'rebass'


const ButtonStyle = styled.button`
  display: inline-block;
  line-height: 1.1;
  background-color: ${props => props.theme.colors.purple};
  color: #fff;
  border: none;
  border-radius: 40px;
  overflow: hidden;
  height: 60px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  outline: none !important;

  span {
    display: block;
    padding: 20px 45px;
    transition: transform 0.25s;
  }

  &:hover,
  &:focus {
    background-color: ${props => props.theme.colors.black};
    transform: rotate(-2.74deg);

    span {
      transform: translateY(-100%);
    }
  }
`

const Button = forwardRef((props, ref) => {
  return (
    <Box as={ButtonStyle} ref={ref} {...props}>
      <span>{props.children}</span>
      <span>{props.children}</span>
    </Box>
  )
})

export default Button
